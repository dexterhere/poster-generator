import React from 'react';
import ReactGridLayout from 'react-grid-layout';
const GridLayout = ReactGridLayout as any;
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { usePosterStore } from '../../store/usePosterStore';
import SectionRenderer from '../sections/SectionRenderer';

interface Props {
  containerWidth: number;
}

const SECTION_CARD_STYLES = {
  'thin': (color: string) => ({
    border: `1px solid ${color}30`,
  }),
  'top-accent': (color: string) => ({
    border: '1px solid #e5e7eb',
    borderTop: `3px solid ${color}`,
  }),
  'shadow': (_color: string) => ({
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  }),
  'filled-header': (color: string) => ({
    border: `1px solid ${color}30`,
  }),
};

const PosterGrid: React.FC<Props> = ({ containerWidth }) => {
  const { sections, theme, selectedSectionId, setSelectedSection, updateSection } = usePosterStore();

  const layout = sections.map((s) => ({
    i: s.id,
    x: s.gridPosition.col,
    y: s.gridPosition.row,
    w: s.gridPosition.colSpan,
    h: s.gridPosition.rowSpan,
    minW: 1,
    maxW: 3,
    minH: 1,
    maxH: 3,
  }));

  const handleLayoutChange = (newLayout: any[]) => {
    newLayout.forEach((l) => {
      updateSection(l.i, {
        gridPosition: {
          col: l.x,
          row: l.y,
          colSpan: l.w,
          rowSpan: l.h,
        },
      });
    });
  };

  const cardStyle = SECTION_CARD_STYLES[theme.borderStyle as keyof typeof SECTION_CARD_STYLES] || SECTION_CARD_STYLES['thin'];

  return (
    <GridLayout
      className="w-full"
      layout={layout}
      cols={3}
      rowHeight={140}
      width={containerWidth}
      margin={[10, 10]}
      containerPadding={[12, 12]}
      onLayoutChange={handleLayoutChange}
      isDraggable={true}
      isResizable={true}
      resizeHandles={['se']}
    >
      {sections.map((section) => {
        const isSelected = selectedSectionId === section.id;
        return (
          <div
            key={section.id}
            onClick={() => setSelectedSection(isSelected ? null : section.id)}
            className="rounded-xl overflow-hidden flex flex-col cursor-pointer transition-all duration-150 select-none"
            style={{
              ...cardStyle(theme.primaryColor),
              outline: isSelected ? `2px solid ${theme.primaryColor}` : undefined,
              outlineOffset: isSelected ? '2px' : undefined,
              backgroundColor: 'white',
            }}
          >
            {/* Section header bar */}
            <div
              className="px-3 py-1.5 flex-shrink-0 flex items-center justify-between"
              style={
                theme.borderStyle === 'filled-header'
                  ? { backgroundColor: theme.primaryColor, color: 'white' }
                  : { backgroundColor: theme.primaryColor + '15', color: theme.primaryColor }
              }
            >
              <span className="text-[10px] font-bold uppercase tracking-wide truncate">
                {section.title}
              </span>
              {isSelected && (
                <span className="text-[8px] opacity-70 ml-2 flex-shrink-0">✏️ editing</span>
              )}
            </div>
            {/* Section content */}
            <div className="flex-1 overflow-hidden min-h-0">
              <SectionRenderer
                section={section}
                primaryColor={theme.primaryColor}
                borderStyle={theme.borderStyle}
              />
            </div>
          </div>
        );
      })}
    </GridLayout>
  );
};

export default PosterGrid;
