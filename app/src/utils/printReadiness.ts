/*
 * What does this file do?
 * Provides print-readiness and readability checks for poster exports.
 *
 * List of methods/functions file contains:
 * - getSectionReadableFontSize
 * - getSectionContentLoad
 * - analyzePrintReadiness
 * - improvePosterReadability
 *
 * Date and Day of last modification:
 * May 27, 2026, Wednesday
 */
import type { PosterState, Section, SectionStyle, TableContent } from '../store/usePosterStore';

export type PrintIssueSeverity = 'error' | 'warning' | 'info';

export interface PrintIssue {
  id: string;
  severity: PrintIssueSeverity;
  label: string;
  detail: string;
  sectionId?: string;
}

export interface PrintReadinessReport {
  score: number;
  issues: PrintIssue[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
  minimumBodySize: number;
  minimumTableSize: number;
}

const MIN_BODY_SIZE = 9;
const MIN_TABLE_CELL_SIZE = 8;
const MIN_TITLE_SIZE = 10;
const MIN_HEADER_TITLE_SIZE = 26;
const MIN_HEADER_INFO_SIZE = 9;
const SAFE_MARGIN_MM = 10;
const MAX_CHARS_PER_SQ_MM = 0.024;

const isTableContent = (content: Section['content']): content is TableContent =>
  'columns' in content && Array.isArray(content.columns) && 'rows' in content && Array.isArray(content.rows);

export function getSectionReadableFontSize(section: Section): number {
  const style = section.style ?? {};
  if (section.type === 'table') return style.tableCellFontSize ?? style.fontSize ?? 7;
  if (section.type === 'question') return style.fontSize ?? 16;
  if (section.type === 'stats') return style.fontSize ?? 18;
  return style.fontSize ?? 9;
}

export function getSectionContentLoad(section: Section): number {
  const content = section.content;
  if (section.type === 'table' && isTableContent(content)) {
    return [...content.columns, ...content.rows.flat()].join(' ').length;
  }
  if ('body' in content) return `${content.body ?? ''} ${content.highlightBox ?? ''}`.length;
  if ('items' in content) return `${content.intro ?? ''} ${content.items.map((item) => item.text).join(' ')}`.length;
  if ('steps' in content) return content.steps.map((step) => `${step.name} ${step.description}`).join(' ').length;
  if ('stats' in content) return content.stats.map((stat) => `${stat.value} ${stat.label}`).join(' ').length;
  if ('questionText' in content) return `${content.questionText} ${content.subtext}`.length;
  if ('caption' in content) return content.caption.length;
  if ('leftLabel' in content) return `${content.leftLabel} ${content.rightLabel}`.length;
  return 0;
}

const addIssue = (issues: PrintIssue[], issue: PrintIssue) => {
  issues.push(issue);
};

export function analyzePrintReadiness(state: PosterState): PrintReadinessReport {
  const issues: PrintIssue[] = [];
  const { header, layout, sections, theme } = state;
  const headerEnabled = theme.headerEnabled !== false;

  if (!layout.width || !layout.height) {
    addIssue(issues, {
      id: 'paper-size',
      severity: 'error',
      label: 'Invalid paper size',
      detail: 'Set a valid A1 paper size before exporting.',
    });
  }

  if (headerEnabled && header.projectTitle.trim().length === 0) {
    addIssue(issues, {
      id: 'missing-title',
      severity: 'warning',
      label: 'Missing project title',
      detail: 'A visible title helps viewers understand the poster from a distance.',
    });
  }

  if (headerEnabled && header.titleFontSize < MIN_HEADER_TITLE_SIZE) {
    addIssue(issues, {
      id: 'small-header-title',
      severity: 'warning',
      label: 'Header title may print too small',
      detail: `Use at least ${MIN_HEADER_TITLE_SIZE}px for the main poster title.`,
    });
  }

  if (headerEnabled && header.infoFontSize < MIN_HEADER_INFO_SIZE) {
    addIssue(issues, {
      id: 'small-header-info',
      severity: 'info',
      label: 'Header identity text is small',
      detail: `Use ${MIN_HEADER_INFO_SIZE}px or larger for student, supervisor, and institution details.`,
    });
  }

  sections.forEach((section) => {
    const area = Math.max(1, section.position.width * section.position.height);
    const contentLoad = getSectionContentLoad(section);
    const density = contentLoad / area;
    const style = section.style ?? {};
    const bodySize = getSectionReadableFontSize(section);
    const titleSize = style.titleFontSize ?? 10;

    if (
      section.position.x < 0 ||
      section.position.y < 0 ||
      section.position.x + section.position.width > layout.width ||
      section.position.y + section.position.height > layout.height
    ) {
      addIssue(issues, {
        id: `overflow-${section.id}`,
        severity: 'error',
        label: `${section.title} is outside the board`,
        detail: 'Move this section fully inside the A1 poster before export.',
        sectionId: section.id,
      });
    }

    if (
      section.position.x < SAFE_MARGIN_MM ||
      section.position.y < SAFE_MARGIN_MM ||
      section.position.x + section.position.width > layout.width - SAFE_MARGIN_MM ||
      section.position.y + section.position.height > layout.height - SAFE_MARGIN_MM
    ) {
      addIssue(issues, {
        id: `safe-area-${section.id}`,
        severity: 'info',
        label: `${section.title} is close to the print edge`,
        detail: `Keep important content at least ${SAFE_MARGIN_MM}mm from the paper edge.`,
        sectionId: section.id,
      });
    }

    if (!style.hideTitle && titleSize < MIN_TITLE_SIZE) {
      addIssue(issues, {
        id: `small-title-${section.id}`,
        severity: 'warning',
        label: `${section.title} title is small`,
        detail: `Section titles should be at least ${MIN_TITLE_SIZE}px for clear printed scanning.`,
        sectionId: section.id,
      });
    }

    if (section.type === 'table' && bodySize < MIN_TABLE_CELL_SIZE) {
      addIssue(issues, {
        id: `small-table-${section.id}`,
        severity: 'warning',
        label: `${section.title} table text is small`,
        detail: `Table cells should be ${MIN_TABLE_CELL_SIZE}px or larger for A1 printing.`,
        sectionId: section.id,
      });
    }

    if (section.type !== 'table' && bodySize < MIN_BODY_SIZE) {
      addIssue(issues, {
        id: `small-body-${section.id}`,
        severity: 'warning',
        label: `${section.title} body text is small`,
        detail: `Use at least ${MIN_BODY_SIZE}px body text for comfortable poster reading.`,
        sectionId: section.id,
      });
    }

    if (density > MAX_CHARS_PER_SQ_MM) {
      addIssue(issues, {
        id: `dense-${section.id}`,
        severity: 'warning',
        label: `${section.title} has too much content`,
        detail: 'Increase the section size, reduce text, or split the content into multiple sections.',
        sectionId: section.id,
      });
    }

    if (section.type === 'image' && 'imageUrl' in section.content && !section.content.imageUrl) {
      addIssue(issues, {
        id: `empty-image-${section.id}`,
        severity: 'warning',
        label: `${section.title} image is empty`,
        detail: 'Upload an image or remove the placeholder before export.',
        sectionId: section.id,
      });
    }
  });

  const errorCount = issues.filter((issue) => issue.severity === 'error').length;
  const warningCount = issues.filter((issue) => issue.severity === 'warning').length;
  const infoCount = issues.filter((issue) => issue.severity === 'info').length;
  const score = Math.max(0, 100 - errorCount * 25 - warningCount * 10 - infoCount * 3);

  return {
    score,
    issues,
    errorCount,
    warningCount,
    infoCount,
    minimumBodySize: MIN_BODY_SIZE,
    minimumTableSize: MIN_TABLE_CELL_SIZE,
  };
}

export function improvePosterReadability(section: Section): SectionStyle {
  const style = section.style ?? {};
  const next: SectionStyle = {
    ...style,
    titleFontSize: Math.max(style.titleFontSize ?? 10, MIN_TITLE_SIZE),
    lineHeight: Math.max(style.lineHeight ?? 1.35, 1.35),
  };

  if (section.type === 'table') {
    next.tableCellFontSize = Math.max(style.tableCellFontSize ?? style.fontSize ?? 7, MIN_TABLE_CELL_SIZE);
    next.tableHeaderFontSize = Math.max(style.tableHeaderFontSize ?? 8, MIN_TABLE_CELL_SIZE + 1);
    next.tableDensity = style.tableDensity ?? 'cozy';
  } else {
    next.fontSize = Math.max(style.fontSize ?? MIN_BODY_SIZE, MIN_BODY_SIZE);
  }

  return next;
}
