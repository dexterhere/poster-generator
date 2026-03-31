import React from 'react';
import { usePosterStore } from '../../store/usePosterStore';

const PosterFooter: React.FC = () => {
  const { footer, theme } = usePosterStore();

  return (
    <div
      className="w-full px-8 py-2 flex items-center justify-center text-xs font-medium text-white"
      style={{ backgroundColor: theme.primaryColor }}
    >
      {footer.text || 'Student Name | ID | Institution | Year'}
    </div>
  );
};

export default PosterFooter;
