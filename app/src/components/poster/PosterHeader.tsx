import React, { useRef } from 'react';
import { usePosterStore } from '../../store/usePosterStore';

const PosterHeader: React.FC = () => {
  const { header, theme } = usePosterStore();
  const uniLogoRef = useRef<HTMLInputElement>(null);
  const collegeLogoRef = useRef<HTMLInputElement>(null);
  const { updateHeader } = usePosterStore();

  const handleLogo = (side: 'university' | 'college', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      if (side === 'university') updateHeader({ universityLogoUrl: url });
      else updateHeader({ collegeLogoUrl: url });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="w-full flex items-center gap-6 px-8 py-5 border-b-[6px]"
      style={{ borderColor: theme.primaryColor }}
    >
      {/* Left Logo */}
      <div
        className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors bg-white"
        onClick={() => uniLogoRef.current?.click()}
        title="Click to upload university logo"
      >
        {header.universityLogoUrl ? (
          <img src={header.universityLogoUrl} alt="University Logo" className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-[9px] text-neutral-400 text-center leading-tight px-1">University<br />Logo</span>
        )}
        <input ref={uniLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo('university', e)} />
      </div>

      {/* Centre: Title */}
      <div className="flex-1 text-center">
        <h1 className="text-3xl font-black uppercase tracking-tight text-neutral-900 leading-tight">
          {header.projectTitle || 'Your Project Title'}
        </h1>
        {header.academicQuestion && (
          <p className="text-base mt-2 font-serif italic text-neutral-600">
            {header.academicQuestion}
          </p>
        )}
        <div
          className="inline-flex gap-6 mt-3 text-sm font-medium text-neutral-700 py-1.5 px-5 rounded-full border"
          style={{ backgroundColor: theme.primaryColor + '10', borderColor: theme.primaryColor + '30' }}
        >
          <span>{header.studentName}{header.studentId ? ` (${header.studentId})` : ''}</span>
          {header.supervisorName && (
            <>
              <span style={{ color: theme.primaryColor + '60' }}>|</span>
              <span>Supervisor: {header.supervisorName}</span>
            </>
          )}
          {header.readerName && (
            <>
              <span style={{ color: theme.primaryColor + '60' }}>|</span>
              <span>Reader: {header.readerName}</span>
            </>
          )}
        </div>
      </div>

      {/* Right Logo */}
      <div
        className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-200 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors bg-white"
        onClick={() => collegeLogoRef.current?.click()}
        title="Click to upload college logo"
      >
        {header.collegeLogoUrl ? (
          <img src={header.collegeLogoUrl} alt="College Logo" className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-[9px] text-neutral-400 text-center leading-tight px-1">College<br />Logo</span>
        )}
        <input ref={collegeLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo('college', e)} />
      </div>
    </div>
  );
};

export default PosterHeader;
