import { create } from 'zustand';

export type SectionType = 'text' | 'table' | 'flow' | 'split-image' | 'image' | 'list' | 'stats' | 'question';

export interface CanvasPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

// Typed content per section
export interface TextContent {
  body: string;
  highlightBox?: string;
}

export interface TableContent {
  columns: string[];
  rows: string[][];
}

export interface FlowStep {
  name: string;
  description: string;
  highlight: boolean;
}

export interface FlowContent {
  direction?: 'horizontal' | 'vertical';
  steps: FlowStep[];
}

export interface ImageContent {
  imageUrl: string | null;
  caption: string;
  fit: 'contain' | 'cover';
}

export interface SplitImageContent {
  leftImageUrl: string | null;
  leftLabel: string;
  rightImageUrl: string | null;
  rightLabel: string;
  direction?: 'horizontal' | 'vertical';
  fit?: 'contain' | 'cover';
}

export interface ListItem {
  text: string;
  tag?: string;
}

export interface ListContent {
  style: 'bullet' | 'numbered';
  items: ListItem[];
  intro?: string;   // optional paragraph rendered above the list (e.g. project aim)
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsContent {
  stats: StatItem[];
}

export interface QuestionContent {
  questionText: string;
  subtext: string;
}

export type SectionContent =
  | TextContent
  | TableContent
  | FlowContent
  | ImageContent
  | SplitImageContent
  | ListContent
  | StatsContent
  | QuestionContent;

export interface SectionStyle {
  padding?: number;
  fontSize?: number;                           // px — base body font size (8–28)
  titleFontSize?: number;                      // px — section title size
  titleFontFamily?: 'display' | 'body' | 'mono';
  titleAlign?: 'left' | 'center' | 'right';   // title bar alignment
  borderRadius?: number;                       // px — card corner radius
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  lineHeight?: number;                         // multiplier e.g. 1.4
  tableHeaderBgColor?: string;
  tableHeaderTextColor?: string;
  tableCellTextColor?: string;
  tableHeaderFontSize?: number;
  tableCellFontSize?: number;
  containerStyle?:
    | 'default'
    | 'none'
    | 'card'
    | 'outline'
    | 'accent-top'
    | 'filled'
    | 'minimal'
    | 'glass'
    | 'accent-left'
    | 'elevated'
    | 'soft-fill';
  hideTitle?: boolean;
}

export interface Section {
  id: string;
  position: CanvasPosition;
  type: SectionType;
  title: string;
  content: SectionContent;
  style?: SectionStyle;
}

export type HeaderLayout = 'academic' | 'minimal' | 'banner' | 'centered';

export interface PosterState {
  id: string;
  selectedSectionId: string | null;
  header: {
    // Layout preset
    headerLayout: HeaderLayout;
    // Logos
    universityLogoUrl: string | null;
    collegeLogoUrl: string | null;
    // Core fields
    projectTitle: string;
    studentName: string;
    studentId: string;
    supervisorName: string;
    readerName: string;
    // Extra fields
    department: string;
    institution: string;
    year: string;
    // Visibility toggles
    showStudentInfo: boolean;
    showSupervisor: boolean;
    showReader: boolean;
    showDepartment: boolean;
    // Title font size in px (replaces preset string)
    titleFontSize: number;
    // Info-bar layout template
    infoLayout: 'inline' | 'stacked' | 'two-row' | 'grid';
    // Header vertical padding in px
    headerPadding: number;
    // Info-bar text size in px
    infoFontSize: number;
  };
  footer: {
    text: string;
  };

  theme: {
    primaryColor: string;
    fontPairing: string;
    borderStyle: 'thin' | 'top-accent' | 'shadow' | 'filled-header';
    footerEnabled: boolean;
    rulerEnabled: boolean;
  };
  layout: {
    width: number;
    height: number;
    name: string;
  };
  sections: Section[];

  // Actions
  setSelectedSection: (id: string | null) => void;
  updateHeader: (header: Partial<PosterState['header']>) => void;
  updateFooter: (footer: Partial<PosterState['footer']>) => void;
  updateTheme: (theme: Partial<PosterState['theme']>) => void;
  updateLayout: (layout: Partial<PosterState['layout']>) => void;
  updateSection: (id: string, section: Partial<Section>) => void;
  updateSectionContent: (id: string, content: Partial<SectionContent>) => void;
  addSection: (section: Section) => void;
  deleteSection: (id: string) => void;

}

const DEFAULT_TEXT_CONTENT: TextContent = {
  body: 'Write your content here...',
  highlightBox: '',
};

export function defaultContentForType(type: SectionType): SectionContent {
  switch (type) {
    case 'text':
      return { body: 'Write your content here...', highlightBox: '' };
    case 'table':
      return {
        columns: ['Author & Year', 'Study Focus', 'Key Finding', 'Relevance'],
        rows: [['', '', '', '']],
      };
    case 'flow':
      return {
        direction: 'horizontal',
        steps: [
          { name: 'Step One', description: 'Describe this step', highlight: false },
          { name: 'Step Two', description: 'Describe this step', highlight: false },
          { name: 'Step Three', description: 'Describe this step', highlight: true },
        ],
      };
    case 'image':
      return { imageUrl: null, caption: '', fit: 'contain' };
    case 'split-image':
      return { leftImageUrl: null, leftLabel: 'Initial Plan', rightImageUrl: null, rightLabel: 'Final Progress', direction: 'horizontal', fit: 'contain' };
    case 'list':
      return { style: 'bullet', intro: '', items: [{ text: 'First objective' }, { text: 'Second objective' }] };
    case 'stats':
      return { stats: [{ value: '95%', label: 'Test Coverage' }, { value: '4', label: 'Sprints' }] };
    case 'question':
      return { questionText: 'What is the main research question of this study?', subtext: 'Detailed hypothesis or sub-question goes here.' };
    default:
      return DEFAULT_TEXT_CONTENT;
  }
}

const initialSections: Section[] = [];

export const usePosterStore = create<PosterState>((set) => ({
  id: 'unique-poster-id',
  selectedSectionId: null,
  header: {
    headerLayout: 'academic' as HeaderLayout,
    universityLogoUrl: null,
    collegeLogoUrl: null,
    projectTitle: 'Your Project Title',
    studentName: 'Your Full Name',
    studentId: 'Student ID',
    supervisorName: 'Supervisor Name',
    readerName: 'Second Reader Name',
    department: '',
    institution: '',
    year: new Date().getFullYear().toString(),
    showStudentInfo: true,
    showSupervisor: true,
    showReader: true,
    showDepartment: false,
    titleFontSize: 32,
    infoLayout: 'inline' as const,
    headerPadding: 12,
    infoFontSize: 12,
  },
  footer: {
    text: 'Your Name | Student ID | Your Institution | Year',
  },

  theme: {
    primaryColor: '#0D7377',
    fontPairing: 'classic-academic',
    borderStyle: 'filled-header',
    footerEnabled: false,
    rulerEnabled: true,
  },
  layout: {
    width: 841,  // A1 Landscape — 1px = 1mm
    height: 594,
    name: 'A1 Landscape',
  },
  sections: initialSections,

  setSelectedSection: (id) => set({ selectedSectionId: id }),
  updateHeader: (header) => set((state) => ({ header: { ...state.header, ...header } })),
  updateFooter: (footer) => set((state) => ({ footer: { ...state.footer, ...footer } })),
  updateTheme: (theme) => set((state) => ({ theme: { ...state.theme, ...theme } })),
  updateLayout: (layout) => set((state) => ({ layout: { ...state.layout, ...layout } })),
  updateSection: (id, newSection) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === id ? { ...s, ...newSection } : s)),
    })),
  updateSectionContent: (id, content) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, content: { ...s.content, ...content } } : s
      ),
    })),
  addSection: (section) => set((state) => ({ sections: [...state.sections, section] })),
  deleteSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
    })),

}));
