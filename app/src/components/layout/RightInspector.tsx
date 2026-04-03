import React from 'react';
import SectionEditor from '../editor/SectionEditor';

interface RightInspectorProps {
  isVisible: boolean;
}

const RightInspector: React.FC<RightInspectorProps> = ({ isVisible }) => {
  return (
    <div
      className="absolute right-0 top-0 bottom-0 z-30 bg-white border-l border-neutral-200 shadow-xl transition-transform duration-200 ease-in-out print:hidden"
      style={{
        width: '280px',
        transform: isVisible ? 'translateX(0)' : 'translateX(280px)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <SectionEditor />
    </div>
  );
};

export default RightInspector;
