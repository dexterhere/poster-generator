import { create } from 'zustand';

export type SectionType = 'text' | 'table' | 'flow' | 'split-image' | 'image' | 'list' | 'stats';

export interface GridPosition {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
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
}

export interface ListItem {
  text: string;
  tag?: string;
}

export interface ListContent {
  style: 'bullet' | 'numbered';
  items: ListItem[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface StatsContent {
  stats: StatItem[];
}

export type SectionContent =
  | TextContent
  | TableContent
  | FlowContent
  | ImageContent
  | SplitImageContent
  | ListContent
  | StatsContent;

export interface Section {
  id: string;
  gridPosition: GridPosition;
  type: SectionType;
  title: string;
  content: SectionContent;
}

export interface PosterState {
  id: string;
  selectedSectionId: string | null;
  header: {
    universityLogoUrl: string | null;
    collegeLogoUrl: string | null;
    projectTitle: string;
    studentName: string;
    studentId: string;
    supervisorName: string;
    readerName: string;
    academicQuestion: string;
  };
  footer: {
    text: string;
  };
  layout: {
    orientation: 'landscape' | 'portrait';
    rows: number;
    columns: number;
  };
  theme: {
    primaryColor: string;
    fontPairing: string;
    borderStyle: 'thin' | 'top-accent' | 'shadow' | 'filled-header';
  };
  sections: Section[];

  // Actions
  setSelectedSection: (id: string | null) => void;
  updateHeader: (header: Partial<PosterState['header']>) => void;
  updateFooter: (footer: Partial<PosterState['footer']>) => void;
  updateTheme: (theme: Partial<PosterState['theme']>) => void;
  updateSection: (id: string, section: Partial<Section>) => void;
  updateSectionContent: (id: string, content: Partial<SectionContent>) => void;
  addSection: (section: Section) => void;
  deleteSection: (id: string) => void;
  updateLayout: (layout: Partial<PosterState['layout']>) => void;
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
        steps: [
          { name: 'Step One', description: 'Describe this step', highlight: false },
          { name: 'Step Two', description: 'Describe this step', highlight: false },
          { name: 'Step Three', description: 'Describe this step', highlight: true },
        ],
      };
    case 'image':
      return { imageUrl: null, caption: '', fit: 'contain' };
    case 'split-image':
      return { leftImageUrl: null, leftLabel: 'Initial Plan', rightImageUrl: null, rightLabel: 'Final Progress' };
    case 'list':
      return { style: 'bullet', items: [{ text: 'First item' }, { text: 'Second item' }] };
    case 'stats':
      return { stats: [{ value: '95%', label: 'Test Coverage' }, { value: '4', label: 'Sprints' }] };
    default:
      return DEFAULT_TEXT_CONTENT;
  }
}

const initialSections: Section[] = [
  {
    id: 'section-1',
    gridPosition: { row: 0, col: 0, rowSpan: 1, colSpan: 1 },
    type: 'text',
    title: 'Introduction',
    content: { body: 'CampusSync is a gamified university management platform...', highlightBox: 'Key innovation: digital points redeemable at the campus canteen.' },
  },
  {
    id: 'section-2',
    gridPosition: { row: 0, col: 1, rowSpan: 1, colSpan: 1 },
    type: 'table',
    title: 'Literature Review',
    content: {
      columns: ['Author & Year', 'Study Focus', 'Key Finding', 'Relevance'],
      rows: [
        ['Meng et al. (2024)', 'Gamification in online learning', '+15% participation', 'Confirms points system works'],
        ['Smith et al. (2023)', 'Student engagement strategies', '20% grade improvement', 'Supports reward mechanics'],
      ],
    },
  },
  {
    id: 'section-3',
    gridPosition: { row: 0, col: 2, rowSpan: 1, colSpan: 1 },
    type: 'flow',
    title: 'App Process Flow',
    content: {
      steps: [
        { name: 'Student completes a task', description: 'Submits assignment or attends class', highlight: false },
        { name: 'Points are awarded', description: 'Added to student account automatically', highlight: false },
        { name: 'Reward selected', description: 'Student picks from canteen catalog', highlight: true },
        { name: 'QR code generated', description: 'Encrypted one-time use code shown', highlight: true },
      ],
    },
  },
  {
    id: 'section-4',
    gridPosition: { row: 1, col: 0, rowSpan: 1, colSpan: 1 },
    type: 'list',
    title: 'Aims & Objectives',
    content: {
      style: 'numbered',
      items: [
        { text: 'Design a gamified points economy for university tasks', tag: 'AIM' },
        { text: 'Implement QR-code based reward redemption at the canteen', tag: 'OBJ' },
        { text: 'Build an admin dashboard for staff to manage the system', tag: 'OBJ' },
        { text: 'Ensure the system scales to 500+ concurrent students', tag: 'OBJ' },
      ],
    },
  },
  {
    id: 'section-5',
    gridPosition: { row: 1, col: 1, rowSpan: 1, colSpan: 1 },
    type: 'image',
    title: 'System Diagram',
    content: { imageUrl: null, caption: 'High-level system architecture diagram', fit: 'contain' },
  },
  {
    id: 'section-6',
    gridPosition: { row: 1, col: 2, rowSpan: 1, colSpan: 1 },
    type: 'stats',
    title: 'Key Metrics',
    content: {
      stats: [
        { value: '95%', label: 'Test Coverage' },
        { value: '4', label: 'Agile Sprints' },
        { value: '500+', label: 'Students' },
        { value: 'A*', label: 'Grade Target' },
      ],
    },
  },
  {
    id: 'section-7',
    gridPosition: { row: 2, col: 0, rowSpan: 1, colSpan: 1 },
    type: 'split-image',
    title: 'Project Process — Gantt Chart',
    content: { leftImageUrl: null, leftLabel: 'Initial Plan', rightImageUrl: null, rightLabel: 'Final Progress' },
  },
  {
    id: 'section-8',
    gridPosition: { row: 2, col: 1, rowSpan: 1, colSpan: 1 },
    type: 'text',
    title: 'Evaluation & Reflection',
    content: { body: 'The project successfully met all primary objectives. The gamification system proved effective in increasing student engagement scores by an average of 18% during the testing period.', highlightBox: 'Key challenge: Balancing reward value without inflating the points economy.' },
  },
  {
    id: 'section-9',
    gridPosition: { row: 2, col: 2, rowSpan: 1, colSpan: 1 },
    type: 'text',
    title: 'Conclusion & Future Scope',
    content: { body: 'CampusSync demonstrates that gamification is an effective tool for improving student engagement in university environments. Future work will explore direct API integration with university timetabling systems and expansion to multiple institutions.', highlightBox: '' },
  },
];

export const usePosterStore = create<PosterState>((set) => ({
  id: 'unique-poster-id',
  selectedSectionId: null,
  header: {
    universityLogoUrl: null,
    collegeLogoUrl: null,
    projectTitle: 'CampusSync: University Management & Gamification System',
    studentName: 'Prince Bhagat',
    studentId: '2406779',
    supervisorName: 'Mr. Bhanu Aryal',
    readerName: 'Mr. Subash Bista',
    academicQuestion: 'How can gamification improve student engagement in higher education?',
  },
  footer: {
    text: 'Prince Bhagat | 2406779 | Herald College Kathmandu | 2025–2026',
  },
  layout: {
    orientation: 'landscape',
    rows: 3,
    columns: 3,
  },
  theme: {
    primaryColor: '#0D7377',
    fontPairing: 'classic-academic',
    borderStyle: 'filled-header',
  },
  sections: initialSections,

  setSelectedSection: (id) => set({ selectedSectionId: id }),
  updateHeader: (header) => set((state) => ({ header: { ...state.header, ...header } })),
  updateFooter: (footer) => set((state) => ({ footer: { ...state.footer, ...footer } })),
  updateTheme: (theme) => set((state) => ({ theme: { ...state.theme, ...theme } })),
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
  updateLayout: (layout) => set((state) => ({ layout: { ...state.layout, ...layout } })),
}));
