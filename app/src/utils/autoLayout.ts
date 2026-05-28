/*
 * What does this file do?
 * Provides reusable smart layout helpers for arranging poster sections on the canvas.
 *
 * Methods/functions this file contains:
 * - hasUsablePosition
 * - autoLayoutSections
 *
 * Date and Day of last modification:
 * May 26, 2026 - Tuesday
 */
import type { ListContent, PosterState, QuestionContent, Section, SectionStyle } from '../store/usePosterStore';

interface AutoLayoutOptions {
  preserveExistingPositions?: boolean;
}

const HEADER_SPACE = 96;
const FOOTER_SPACE = 38;
const MARGIN = 18;
const GAP = 14;

export function hasUsablePosition(section: Section): boolean {
  const pos = section.position;
  return !!pos && pos.width > 60 && pos.height > 60;
}

function preferredHeight(section: Section, columnWidth: number): number {
  const title = section.title.toLowerCase();

  if (section.type === 'stats') return 118;
  if (section.type === 'question') return 104;
  if (section.type === 'image' || section.type === 'split-image') return 230;
  if (section.type === 'flow' || title.includes('method')) return 156;
  if (section.type === 'table' || title.includes('literature')) return 210;
  if (section.type === 'list') {
    const content = section.content as ListContent;
    const itemCount = Array.isArray(content.items) ? content.items.length : 3;
    return Math.min(170, Math.max(96, 42 + itemCount * 19));
  }

  return Math.max(160, Math.round(columnWidth * 0.52));
}

function shouldSpan(section: Section): boolean {
  const title = section.title.toLowerCase();
  return section.type === 'flow' || title.includes('method') || title.includes('abstract') || title.includes('diagram');
}

function styleDefaultsForSection(section: Section): SectionStyle {
  const title = section.title.toLowerCase();
  const base = section.style ?? {};

  if (section.type === 'list') {
    return {
      ...base,
      fontSize: base.fontSize ?? 8,
      lineHeight: base.lineHeight ?? 1.22,
      padding: base.padding ?? 8,
      titleFontSize: base.titleFontSize ?? 9,
      titlePaddingY: base.titlePaddingY ?? 4,
      listVariant: base.listVariant ?? (title.includes('objective') || title.includes('evaluation') ? 'compact' : 'minimal'),
      listDensity: base.listDensity ?? 'tight',
      listMarkerSize: base.listMarkerSize ?? 12,
      containerStyle: base.containerStyle ?? 'minimal',
    };
  }

  if (section.type === 'question') {
    const content = section.content as QuestionContent;
    return {
      ...base,
      fontSize: base.fontSize ?? 13,
      lineHeight: base.lineHeight ?? 1.22,
      padding: base.padding ?? 10,
      titleFontSize: base.titleFontSize ?? 9,
      titlePaddingY: base.titlePaddingY ?? 4,
      textAlign: base.textAlign ?? 'center',
      questionVariant: base.questionVariant ?? (content.subtext ? 'framed' : 'spotlight'),
      containerStyle: base.containerStyle ?? 'ghost',
    };
  }

  if (section.type === 'table') {
    return {
      ...base,
      fontSize: base.fontSize ?? 8,
      tableCellFontSize: base.tableCellFontSize ?? 8,
      tableHeaderFontSize: base.tableHeaderFontSize ?? 8,
      tableDensity: base.tableDensity ?? 'compact',
      tableVariant: base.tableVariant ?? 'ruled',
    };
  }

  return base;
}

export function autoLayoutSections(
  sections: Section[],
  layout: PosterState['layout'],
  theme: PosterState['theme'],
  options: AutoLayoutOptions = {},
): Section[] {
  if (sections.length === 0) return [];

  const top = theme.headerEnabled === false ? MARGIN : HEADER_SPACE + MARGIN;
  const bottom = theme.footerEnabled ? FOOTER_SPACE : MARGIN;
  const availableWidth = layout.width - MARGIN * 2;
  const availableHeight = layout.height - top - bottom;
  const columns = layout.width >= layout.height ? 3 : 2;
  const columnWidth = Math.floor((availableWidth - GAP * (columns - 1)) / columns);
  const columnHeights = new Array(columns).fill(0);

  return sections.map((section, index) => {
    const styledSection = { ...section, style: styleDefaultsForSection(section) };
    if (options.preserveExistingPositions && hasUsablePosition(section)) {
      return { ...styledSection, position: { ...section.position, zIndex: section.position.zIndex || index + 1 } };
    }

    if (shouldSpan(section) && columns > 1) {
      const y = top + Math.max(...columnHeights);
      const height = Math.min(preferredHeight(section, availableWidth), Math.max(120, availableHeight - Math.max(...columnHeights)));
      columnHeights.fill(Math.max(...columnHeights) + height + GAP);
      return {
        ...styledSection,
        position: {
          x: MARGIN,
          y,
          width: availableWidth,
          height,
          zIndex: index + 1,
        },
      };
    }

    const column = columnHeights.indexOf(Math.min(...columnHeights));
    const rawHeight = preferredHeight(section, columnWidth);
    const height = Math.min(rawHeight, Math.max(110, availableHeight - columnHeights[column]));
    const x = MARGIN + column * (columnWidth + GAP);
    const y = top + columnHeights[column];
    columnHeights[column] += height + GAP;

    return {
      ...styledSection,
      position: {
        x,
        y,
        width: columnWidth,
        height,
        zIndex: index + 1,
      },
    };
  });
}
