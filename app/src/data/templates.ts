import type { PosterDraft } from '../utils/draft';

export interface PosterTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  poster: PosterDraft;
}

const defaultHeader = {
  headerLayout: 'academic' as const,
  universityLogoUrl: null,
  collegeLogoUrl: null,
  projectTitle: 'CampusSync: University Management System',
  studentName: 'Your Name',
  studentId: '2400000',
  supervisorName: 'Dr. Supervisor Name',
  readerName: 'Prof. Reader Name',
  department: 'Computing',
  institution: 'Your University',
  year: new Date().getFullYear().toString(),
  showStudentInfo: true,
  showSupervisor: true,
  showReader: true,
  showDepartment: false,
  titleFontSize: 32,
  infoLayout: 'inline' as const,
  headerPadding: 12,
  infoFontSize: 12,
};

const defaultFooter = {
  text: 'Your Name | Student ID | Your Institution | Year',
};

const defaultTheme = {
  primaryColor: '#0D7377',
  secondaryColor: '#14b8a6',
  fontPairing: 'classic-academic',
  borderStyle: 'filled-header' as const,
  footerEnabled: false,
  rulerEnabled: true,
  safeAreaEnabled: false,
  bleedAreaEnabled: false,
  gridOverlayEnabled: false,
  gridSize: 20,
  snapToGrid: false,
  headerEnabled: true,
};

const defaultLayout = {
  width: 841,
  height: 594,
  name: 'A1 Landscape',
};

function makeTemplate(
  id: string,
  name: string,
  category: string,
  description: string,
  sections: PosterDraft['sections']
): PosterTemplate {
  return {
    id,
    name,
    category,
    description,
    poster: {
      id: `template-${id}`,
      header: { ...defaultHeader, projectTitle: name },
      footer: defaultFooter,
      theme: defaultTheme,
      layout: defaultLayout,
      sections,
    },
  };
}

export const TEMPLATES: PosterTemplate[] = [
  makeTemplate(
    'software-engineering',
    'Software Engineering Project',
    'Computing & Tech',
    'Full project defense poster with introduction, methodology, system architecture, and evaluation sections.',
    [
      {
        id: 'section-1',
        title: 'Introduction',
        type: 'text',
        position: { x: 20, y: 110, width: 380, height: 200, zIndex: 1 },
        content: { body: 'This project addresses the need for an efficient university management system by developing a comprehensive web-based platform...', highlightBox: 'Key innovation: gamified engagement system.' },
      },
      {
        id: 'section-2',
        title: 'Research Question',
        type: 'question',
        position: { x: 420, y: 110, width: 380, height: 120, zIndex: 2 },
        content: { questionText: 'How can gamification improve student engagement in university management systems?', subtext: 'This study hypothesizes that integrating gamification elements will increase student participation by 25%.' },
      },
      {
        id: 'section-3',
        title: 'Aims & Objectives',
        type: 'list',
        position: { x: 20, y: 330, width: 380, height: 220, zIndex: 3 },
        content: { style: 'numbered', intro: 'The aim is to develop a gamified university management platform.', items: [{ text: 'Develop a responsive web application' }, { text: 'Implement gamification features' }, { text: 'Evaluate user engagement metrics' }] },
      },
      {
        id: 'section-4',
        title: 'Literature Review',
        type: 'table',
        position: { x: 420, y: 250, width: 380, height: 200, zIndex: 4 },
        content: { columns: ['Author & Year', 'Focus', 'Key Finding', 'Relevance'], rows: [['Meng et al. (2024)', 'Gamification', '+15% participation', 'Confirms approach']] },
      },
      {
        id: 'section-5',
        title: 'Methodology',
        type: 'flow',
        position: { x: 20, y: 570, width: 780, height: 140, zIndex: 5 },
        content: { direction: 'horizontal', steps: [{ name: 'Requirements', description: 'Gathered user needs', highlight: false }, { name: 'Design', description: 'System architecture', highlight: false }, { name: 'Build', description: 'Core development', highlight: true }, { name: 'Test', description: 'UAT conducted', highlight: false }] },
      },
    ]
  ),

  makeTemplate(
    'data-science',
    'Data Science & ML Results',
    'Data Science & AI',
    'Showcase machine learning models, dataset analysis, accuracy metrics, and comparison charts.',
    [
      {
        id: 'section-1',
        title: 'Problem Statement',
        type: 'text',
        position: { x: 20, y: 110, width: 380, height: 180, zIndex: 1 },
        content: { body: 'Traditional approaches to sentiment analysis struggle with contextual nuance in social media data...', highlightBox: 'Achieved 94.2% accuracy on test set.' },
      },
      {
        id: 'section-2',
        title: 'Dataset Overview',
        type: 'stats',
        position: { x: 420, y: 110, width: 380, height: 120, zIndex: 2 },
        content: { stats: [{ value: '50K', label: 'Training Samples' }, { value: '94.2%', label: 'Accuracy' }, { value: '0.91', label: 'F1 Score' }] },
      },
      {
        id: 'section-3',
        title: 'Model Architecture',
        type: 'image',
        position: { x: 20, y: 310, width: 380, height: 220, zIndex: 3 },
        content: { imageUrl: null, imageId: null, caption: 'Figure 1: Transformer-based architecture diagram', fit: 'contain' },
      },
      {
        id: 'section-4',
        title: 'Results Comparison',
        type: 'table',
        position: { x: 420, y: 250, width: 380, height: 200, zIndex: 4 },
        content: { columns: ['Model', 'Accuracy', 'Precision', 'Recall'], rows: [['Naive Bayes', '78.5%', '76.2%', '80.1%'], ['LSTM', '88.3%', '87.1%', '89.4%'], ['BERT', '94.2%', '93.8%', '94.6%']] },
      },
      {
        id: 'section-5',
        title: 'Key Findings',
        type: 'list',
        position: { x: 20, y: 550, width: 780, height: 160, zIndex: 5 },
        content: { style: 'bullet', intro: 'The BERT-based model outperformed baseline methods across all metrics.', items: [{ text: 'Contextual embeddings significantly improve classification' }, { text: 'Data augmentation boosted minority class performance' }] },
      },
    ]
  ),

  makeTemplate(
    'research-conference',
    'Research Conference Poster',
    'Research & Conference',
    'Clean academic layout optimized for research conferences with abstract, methodology, and findings.',
    [
      {
        id: 'section-1',
        title: 'Abstract',
        type: 'text',
        position: { x: 20, y: 110, width: 780, height: 120, zIndex: 1 },
        content: { body: 'This study investigates the impact of remote work on software developer productivity. Through a mixed-methods approach involving 200 developers across 15 organizations, we found...', highlightBox: 'Remote work increases productivity by 13% when proper tools are provided.' },
      },
      {
        id: 'section-2',
        title: 'Methodology',
        type: 'flow',
        position: { x: 20, y: 250, width: 380, height: 160, zIndex: 2 },
        content: { direction: 'horizontal', steps: [{ name: 'Survey', description: '200 participants', highlight: false }, { name: 'Interview', description: '20 deep dives', highlight: false }, { name: 'Analysis', description: 'Mixed methods', highlight: true }] },
      },
      {
        id: 'section-3',
        title: 'Key Results',
        type: 'stats',
        position: { x: 420, y: 250, width: 380, height: 160, zIndex: 3 },
        content: { stats: [{ value: '13%', label: 'Productivity Gain' }, { value: '200', label: 'Participants' }, { value: '4.2/5', label: 'Satisfaction' }] },
      },
      {
        id: 'section-4',
        title: 'Discussion',
        type: 'text',
        position: { x: 20, y: 430, width: 380, height: 200, zIndex: 4 },
        content: { body: 'Our findings suggest that structured remote work policies, combined with appropriate collaboration tools, create an environment where developers can achieve higher productivity...' },
      },
      {
        id: 'section-5',
        title: 'Conclusion',
        type: 'list',
        position: { x: 420, y: 430, width: 380, height: 200, zIndex: 5 },
        content: { style: 'bullet', intro: 'Key takeaways from this research:', items: [{ text: 'Remote work is viable for software teams' }, { text: 'Tooling investment correlates with productivity' }, { text: 'Hybrid models may offer optimal balance' }] },
      },
    ]
  ),

  makeTemplate(
    'business-proposal',
    'Business Proposal',
    'Business & Management',
    'Professional business poster with problem, solution, market analysis, and financial projections.',
    [
      {
        id: 'section-1',
        title: 'Problem',
        type: 'text',
        position: { x: 20, y: 110, width: 380, height: 180, zIndex: 1 },
        content: { body: 'Small businesses struggle with inventory management, leading to stockouts and overstock situations that cost the industry $1.1 trillion annually...', highlightBox: '1.1 trillion dollars lost annually to poor inventory management.' },
      },
      {
        id: 'section-2',
        title: 'Solution',
        type: 'text',
        position: { x: 420, y: 110, width: 380, height: 180, zIndex: 2 },
        content: { body: 'StockWise is an AI-powered inventory forecasting platform that predicts demand patterns and automates reordering...' },
      },
      {
        id: 'section-3',
        title: 'Market Analysis',
        type: 'table',
        position: { x: 20, y: 310, width: 380, height: 200, zIndex: 3 },
        content: { columns: ['Segment', 'Size', 'Growth', 'Target'], rows: [['SMB Retail', '$12B', '18%', 'Primary'], ['E-commerce', '$8B', '24%', 'Secondary']] },
      },
      {
        id: 'section-4',
        title: 'Financial Projections',
        type: 'stats',
        position: { x: 420, y: 310, width: 380, height: 120, zIndex: 4 },
        content: { stats: [{ value: '$2.4M', label: 'Year 1 Revenue' }, { value: '15%', label: 'Market Share' }, { value: '$500K', label: 'Seed Funding' }] },
      },
      {
        id: 'section-5',
        title: 'Roadmap',
        type: 'flow',
        position: { x: 20, y: 530, width: 780, height: 140, zIndex: 5 },
        content: { direction: 'horizontal', steps: [{ name: 'MVP', description: 'Core features', highlight: false }, { name: 'Beta', description: '50 customers', highlight: false }, { name: 'Launch', description: 'Public release', highlight: true }, { name: 'Scale', description: 'Enterprise tier', highlight: false }] },
      },
    ]
  ),

  makeTemplate(
    'lab-experiment',
    'Lab Experiment',
    'Natural Sciences',
    'Standard science lab poster with hypothesis, method, results, and analysis sections.',
    [
      {
        id: 'section-1',
        title: 'Hypothesis',
        type: 'question',
        position: { x: 20, y: 110, width: 380, height: 120, zIndex: 1 },
        content: { questionText: 'Does increasing CO2 concentration accelerate plant growth in controlled environments?', subtext: 'We predict that elevated CO2 will increase biomass by 20-30% within 8 weeks.' },
      },
      {
        id: 'section-2',
        title: 'Method',
        type: 'text',
        position: { x: 420, y: 110, width: 380, height: 180, zIndex: 2 },
        content: { body: 'Arabidopsis thaliana plants were grown in controlled growth chambers under varying CO2 concentrations (400, 600, 800 ppm)...' },
      },
      {
        id: 'section-3',
        title: 'Results',
        type: 'stats',
        position: { x: 20, y: 250, width: 380, height: 120, zIndex: 3 },
        content: { stats: [{ value: '28%', label: 'Biomass Increase' }, { value: '800', label: 'ppm Optimal' }, { value: 'n=30', label: 'Sample Size' }] },
      },
      {
        id: 'section-4',
        title: 'Data Analysis',
        type: 'image',
        position: { x: 420, y: 310, width: 380, height: 220, zIndex: 4 },
        content: { imageUrl: null, imageId: null, caption: 'Figure 1: Growth curves across CO2 concentrations', fit: 'contain' },
      },
      {
        id: 'section-5',
        title: 'Conclusion',
        type: 'list',
        position: { x: 20, y: 390, width: 380, height: 160, zIndex: 5 },
        content: { style: 'bullet', intro: 'Results support the hypothesis:', items: [{ text: 'Elevated CO2 significantly increased biomass' }, { text: '800 ppm showed optimal growth rate' }, { text: 'Further research needed on long-term effects' }] },
      },
    ]
  ),

  makeTemplate(
    'engineering-hardware',
    'Engineering Hardware Project',
    'Engineering',
    'Hardware and IoT project showcase with system diagram, components, and testing results.',
    [
      {
        id: 'section-1',
        title: 'Project Overview',
        type: 'text',
        position: { x: 20, y: 110, width: 380, height: 180, zIndex: 1 },
        content: { body: 'This project designs and implements a low-cost air quality monitoring station capable of measuring PM2.5, CO2, and VOC levels...', highlightBox: 'Total build cost under $50 per unit.' },
      },
      {
        id: 'section-2',
        title: 'System Architecture',
        type: 'image',
        position: { x: 420, y: 110, width: 380, height: 220, zIndex: 2 },
        content: { imageUrl: null, imageId: null, caption: 'Figure 1: System block diagram', fit: 'contain' },
      },
      {
        id: 'section-3',
        title: 'Components',
        type: 'table',
        position: { x: 20, y: 310, width: 380, height: 200, zIndex: 3 },
        content: { columns: ['Component', 'Model', 'Purpose', 'Cost'], rows: [['MCU', 'ESP32', 'Processing', '$6'], ['PM Sensor', 'PMS5003', 'Particulate', '$12'], ['CO2 Sensor', 'SCD40', 'Gas sensing', '$18']] },
      },
      {
        id: 'section-4',
        title: 'Testing Results',
        type: 'stats',
        position: { x: 420, y: 350, width: 380, height: 120, zIndex: 4 },
        content: { stats: [{ value: '+/-5%', label: 'Accuracy' }, { value: '72h', label: 'Battery Life' }, { value: '50m', label: 'Range' }] },
      },
      {
        id: 'section-5',
        title: 'Future Improvements',
        type: 'list',
        position: { x: 20, y: 530, width: 780, height: 140, zIndex: 5 },
        content: { style: 'numbered', intro: '', items: [{ text: 'Add solar charging capability' }, { text: 'Implement mesh networking for wide-area coverage' }, { text: 'Reduce power consumption for longer battery life' }] },
      },
    ]
  ),

  makeTemplate(
    'minimal-clean',
    'Minimal Clean Layout',
    'Minimal',
    'A bare-bones modern layout with minimal styling for maximum content focus.',
    [
      {
        id: 'section-1',
        title: 'About This Project',
        type: 'text',
        position: { x: 20, y: 110, width: 500, height: 200, zIndex: 1 },
        content: { body: 'Replace this text with your project description. Keep it concise and impactful.' },
      },
      {
        id: 'section-2',
        title: 'Key Metrics',
        type: 'stats',
        position: { x: 540, y: 110, width: 260, height: 120, zIndex: 2 },
        content: { stats: [{ value: '100%', label: 'Placeholder' }, { value: '0', label: 'Edit me' }] },
      },
      {
        id: 'section-3',
        title: 'Visual',
        type: 'image',
        position: { x: 20, y: 330, width: 400, height: 250, zIndex: 3 },
        content: { imageUrl: null, imageId: null, caption: 'Add your diagram or image here', fit: 'contain' },
      },
      {
        id: 'section-4',
        title: 'Details',
        type: 'list',
        position: { x: 440, y: 250, width: 360, height: 200, zIndex: 4 },
        content: { style: 'bullet', intro: '', items: [{ text: 'Add your objectives here' }, { text: 'Add your methodology here' }] },
      },
    ]
  ),
];

export const TEMPLATE_CATEGORIES = Array.from(
  new Set(TEMPLATES.map((t) => t.category))
);

export function getTemplatesByCategory(category: string): PosterTemplate[] {
  if (category === 'All') return TEMPLATES;
  return TEMPLATES.filter((t) => t.category === category);
}
