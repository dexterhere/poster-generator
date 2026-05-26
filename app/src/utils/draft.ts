import {
  defaultContentForType,
  type HeaderLayout,
  type PosterState,
  type Section,
  type SectionContent,
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
    } as SectionContent;
  }

  if (type === 'split-image') {
    return {
      ...content,
      leftImageUrl: null,
      rightImageUrl: null,
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

const normalizeSectionStyle = (style: unknown): Section['style'] =>
  isObject(style)
    ? {
        ...style,
        padding: typeof style.padding === 'number' ? style.padding : 12,
        titleFontSize: typeof style.titleFontSize === 'number' ? style.titleFontSize : undefined,
        titleFontFamily:
          style.titleFontFamily === 'display' || style.titleFontFamily === 'body' || style.titleFontFamily === 'mono'
            ? style.titleFontFamily
            : undefined,
        titleAlign:
          style.titleAlign === 'left' || style.titleAlign === 'center' || style.titleAlign === 'right'
            ? style.titleAlign
            : undefined,
        borderRadius: typeof style.borderRadius === 'number' ? style.borderRadius : undefined,
        tableHeaderBgColor: typeof style.tableHeaderBgColor === 'string' ? style.tableHeaderBgColor : undefined,
        tableHeaderTextColor: typeof style.tableHeaderTextColor === 'string' ? style.tableHeaderTextColor : undefined,
        tableCellTextColor: typeof style.tableCellTextColor === 'string' ? style.tableCellTextColor : undefined,
        tableHeaderFontSize: typeof style.tableHeaderFontSize === 'number' ? style.tableHeaderFontSize : undefined,
        tableCellFontSize: typeof style.tableCellFontSize === 'number' ? style.tableCellFontSize : undefined,
      }
    : { padding: 12 };

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
  typeof layout === 'string' && ['academic', 'minimal', 'banner', 'centered'].includes(layout)
    ? (layout as HeaderLayout)
    : 'academic';

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

  if (isObject(data.theme)) {
    normalized.theme = data.theme as PosterState['theme'];
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
          content: normalizeSectionContent(type, cleanSection.content),
        };
      });
  }

  return normalized;
};
