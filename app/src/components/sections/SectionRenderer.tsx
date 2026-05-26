import React from 'react';
import { type Section, type SectionContent } from '../../store/usePosterStore';
import TextSection from './TextSection';
import TableSection from './TableSection';
import FlowSection from './FlowSection';
import ImageSection from './ImageSection';
import SplitImageSection from './SplitImageSection';
import ListSection from './ListSection';
import StatsSection from './StatsSection';
import QuestionSection from './QuestionSection';

interface Props {
  section: Section;
  primaryColor: string;
  borderStyle: string;
  isSelected?: boolean;
  onUpdateContent?: (content: Partial<SectionContent>) => void;
}

const SectionRenderer: React.FC<Props> = ({
  section,
  primaryColor,
  borderStyle,
  isSelected = false,
  onUpdateContent,
}) => {
  const props = { section, primaryColor, borderStyle, isSelected, onUpdateContent };
  switch (section.type) {
    case 'text':       return <TextSection {...props} />;
    case 'table':      return <TableSection {...props} />;
    case 'flow':       return <FlowSection {...props} />;
    case 'image':      return <ImageSection {...props} />;
    case 'split-image':return <SplitImageSection {...props} />;
    case 'list':       return <ListSection {...props} />;
    case 'stats':      return <StatsSection {...props} />;
    case 'question':   return <QuestionSection {...props} />;
    default:           return <div className="p-4 text-neutral-400 italic">Unknown section type</div>;
  }
};

export default SectionRenderer;
