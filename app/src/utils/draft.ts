import {
  defaultContentForType,
  type HeaderLayout,
  type PosterState,
  type Section,
  type SectionContent,
  type SectionStyle,
  type SectionType,
} from '../store/usePosterStore';

export type PosterDraft = Pick<PosterState, 'id' | 'header' | 'footer' | 'theme' | 'layout' | 'sections'>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sanitizeHeaderForDraft = (header: PosterState['header']): PosterState['header'] => ({
  ...header,
  universityLogoUrl: null,
  collegeLogoUrl: null,
});

const sanitizeSectionContentForDraft = (
  type: SectionType,
  content: SectionContent
): SectionContent => {
  if (type === 'image') {
    return {
      ...content,
      imageUrl: null,
      imageId: null,
    } as SectionContent;
  }

  if (type === 'split-image') {
    return {
      ...content,
      leftImageUrl: null,
      leftImageId: null,
      rightImageUrl: null,
      rightImageId: null,
    } as SectionContent;
  }

  return content;
};

const sanitizeSectionForDraft = (section: Section): Section => ({
  ...section,
  content: sanitizeSectionContentForDraft(section.type, section.content),
});

export const createPosterDraft = (state: PosterState): PosterDraft => ({
  id: state.id,
  header: sanitizeHeaderForDraft(state.header),
  footer: { ...state.footer },
  theme: { ...state.theme },
  layout: { ...state.layout },
  sections: state.sections.map(sanitizeSectionForDraft),
});

const normalizeSectionContent = (type: SectionType, content: unknown): SectionContent => {
  const baseContent = defaultContentForType(type);
  const merged = isObject(content)
    ? ({ ...baseContent, ...content } as SectionContent)
    : baseContent;

  return sanitizeSectionContentForDraft(type, merged);
};

const validContainerStyles = [
  'default', 'none', 'card', 'outline', 'accent-top', 'filled',
  'minimal', 'glass', 'accent-left', 'elevated', 'soft-fill',
  'bordered-pill', 'ghost',
];

const normalizeSectionStyle = (style: unknown): SectionStyle => {
  if (!isObject(style)) return { padding: 12 };

  const result: SectionStyle = { padding: 12 };

  if (typeof style.padding === 'number') result.padding = style.padding;
  if (typeof style.fontSize === 'number') result.fontSize = style.fontSize;
  if (typeof style.titleFontSize === 'number') result.titleFontSize = style.titleFontSize;
  if (typeof style.titlePaddingX === 'number') result.titlePaddingX = style.titlePaddingX;
  if (typeof style.titlePaddingY === 'number') result.titlePaddingY = style.titlePaddingY;
  if (style.titleFontFamily === 'display' || style.titleFontFamily === 'body' || style.titleFontFamily === 'mono')
    result.titleFontFamily = style.titleFontFamily;
  if (style.titleAlign === 'left' || style.titleAlign === 'center' || style.titleAlign === 'right')
    result.titleAlign = style.titleAlign;
  if (typeof style.borderRadius === 'number') result.borderRadius = style.borderRadius;
  if (style.textAlign === 'left' || style.textAlign === 'center' || style.textAlign === 'right')
    result.textAlign = style.textAlign;
  if (style.fontWeight === 'normal' || style.fontWeight === 'bold') result.fontWeight = style.fontWeight;
  if (style.fontStyle === 'normal' || style.fontStyle === 'italic') result.fontStyle = style.fontStyle;
  if (typeof style.lineHeight === 'number') result.lineHeight = style.lineHeight;
  if (typeof style.letterSpacing === 'number') result.letterSpacing = style.letterSpacing;
  if (style.textTransform === 'none' || style.textTransform === 'uppercase' || style.textTransform === 'capitalize')
    result.textTransform = style.textTransform;
  if (typeof style.tableHeaderBgColor === 'string') result.tableHeaderBgColor = style.tableHeaderBgColor;
  if (typeof style.tableHeaderTextColor === 'string') result.tableHeaderTextColor = style.tableHeaderTextColor;
  if (typeof style.tableCellTextColor === 'string') result.tableCellTextColor = style.tableCellTextColor;
  if (typeof style.tableHeaderFontSize === 'number') result.tableHeaderFontSize = style.tableHeaderFontSize;
  if (typeof style.tableCellFontSize === 'number') result.tableCellFontSize = style.tableCellFontSize;
  if (
    style.tableVariant === 'classic'
    || style.tableVariant === 'minimal'
    || style.tableVariant === 'zebra'
    || style.tableVariant === 'ruled'
    || style.tableVariant === 'presentation'
    || style.tableVariant === 'matrix'
  ) result.tableVariant = style.tableVariant;
  if (style.tableDensity === 'compact' || style.tableDensity === 'cozy' || style.tableDensity === 'roomy')
    result.tableDensity = style.tableDensity;
  if (style.tableBorderStyle === 'none' || style.tableBorderStyle === 'subtle' || style.tableBorderStyle === 'grid')
    result.tableBorderStyle = style.tableBorderStyle;
  if (typeof style.tableStriped === 'boolean') result.tableStriped = style.tableStriped;
  if (style.tableHeaderCase === 'none' || style.tableHeaderCase === 'uppercase' || style.tableHeaderCase === 'capitalize')
    result.tableHeaderCase = style.tableHeaderCase;
  if (
    style.listVariant === 'compact'
    || style.listVariant === 'badges'
    || style.listVariant === 'minimal'
    || style.listVariant === 'checklist'
    || style.listVariant === 'timeline'
  ) result.listVariant = style.listVariant;
  if (style.listDensity === 'tight' || style.listDensity === 'normal' || style.listDensity === 'relaxed')
    result.listDensity = style.listDensity;
  if (typeof style.listMarkerSize === 'number') result.listMarkerSize = style.listMarkerSize;
  if (
    style.questionVariant === 'statement'
    || style.questionVariant === 'spotlight'
    || style.questionVariant === 'compact'
    || style.questionVariant === 'framed'
    || style.questionVariant === 'side-accent'
  ) result.questionVariant = style.questionVariant;
  if (typeof style.containerStyle === 'string' && validContainerStyles.includes(style.containerStyle))
    result.containerStyle = style.containerStyle as SectionStyle['containerStyle'];
  if (typeof style.hideTitle === 'boolean') result.hideTitle = style.hideTitle;

  return result;
};

const normalizeSectionPosition = (position: unknown): Section['position'] | undefined => {
  if (!isObject(position)) {
    return undefined;
  }

  const { x, y, width, height, zIndex } = position;

  if (
    typeof x !== 'number'
    || typeof y !== 'number'
    || typeof width !== 'number'
    || typeof height !== 'number'
    || typeof zIndex !== 'number'
  ) {
    return undefined;
  }

  return { x, y, width, height, zIndex };
};

const normalizeSectionType = (type: unknown): SectionType =>
  typeof type === 'string'
  && ['text', 'table', 'flow', 'split-image', 'image', 'list', 'stats', 'question'].includes(type)
    ? (type as SectionType)
    : 'text';

const normalizeHeaderLayout = (layout: unknown): HeaderLayout =>
  typeof layout === 'string' && [
    'academic', 'minimal', 'banner', 'centered', 'split', 'modern',
    'corporate', 'classic', 'bold', 'simple-line', 'two-column',
    'logo-dominant', 'text-dominant', 'underline-accent', 'framed',
    'pill-badge', 'dark-band', 'sidebar-left', 'sidebar-right',
  ].includes(layout)
    ? (layout as HeaderLayout)
    : 'academic';

const normalizeTheme = (theme: unknown): Partial<PosterState['theme']> | undefined => {
  if (!isObject(theme)) return undefined;

  return {
    ...theme,
    gridSize: typeof theme.gridSize === 'number' ? theme.gridSize : 20,
    snapToGrid: typeof theme.snapToGrid === 'boolean' ? theme.snapToGrid : false,
    headerEnabled: typeof theme.headerEnabled === 'boolean' ? theme.headerEnabled : true,
  } as Partial<PosterState['theme']>;
};

export const normalizeLoadedDraft = (raw: unknown): Partial<PosterDraft> & { sections?: Section[] } => {
  if (!isObject(raw)) {
    throw new Error('Invalid draft');
  }

  const { _instructions: _ignored, ...data } = raw;
  void _ignored;

  const normalized: Partial<PosterDraft> & { sections?: Section[] } = {};

  if (typeof data.id === 'string') {
    normalized.id = data.id;
  }

  if (isObject(data.header)) {
    normalized.header = {
      ...data.header,
      headerLayout: normalizeHeaderLayout(data.header.headerLayout),
      universityLogoUrl: null,
      collegeLogoUrl: null,
    } as PosterState['header'];
  }

  if (isObject(data.footer)) {
    normalized.footer = data.footer as PosterState['footer'];
  }

  const theme = normalizeTheme(data.theme);
  if (theme) {
    normalized.theme = theme as PosterState['theme'];
  }

  if (isObject(data.layout)) {
    normalized.layout = data.layout as PosterState['layout'];
  }

  if (Array.isArray(data.sections)) {
    normalized.sections = data.sections
      .filter(isObject)
      .map((section, idx) => {
        const { _schema: _unusedSchema, ...cleanSection } = section;
        void _unusedSchema;

        const type = normalizeSectionType(cleanSection.type);

        return {
          id: typeof cleanSection.id === 'string' && cleanSection.id
            ? cleanSection.id
            : `section-${Date.now()}-${idx}`,
          title: typeof cleanSection.title === 'string' ? cleanSection.title : 'Untitled Section',
          type,
          position: normalizeSectionPosition(cleanSection.position) ?? {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            zIndex: idx + 1,
          },
          style: normalizeSectionStyle(cleanSection.style),
          locked: typeof cleanSection.locked === 'boolean' ? cleanSection.locked : false,
          content: normalizeSectionContent(type, cleanSection.content),
        };
      });
  }

  return normalized;
};
