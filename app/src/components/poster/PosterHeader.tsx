import React, { useRef } from 'react';
import { usePosterStore } from '../../store/usePosterStore';

const TITLE_CLASS: Record<string, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

const LogoSlot: React.FC<{
  url: string | null;
  side: 'university' | 'college';
  onUpload: (side: 'university' | 'college', e: React.ChangeEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  className?: string;
}> = ({ url, side, onUpload, inputRef, className = '' }) => (
  <div
    className={`flex-shrink-0 flex items-center cursor-pointer ${className}`}
    onClick={() => inputRef.current?.click()}
    title={`Click to upload ${side} logo`}
  >
    {url ? (
      <img src={url} alt={`${side} logo`} className="max-h-16 max-w-[100px] object-contain" />
    ) : (
      <div className="w-16 h-16 border border-neutral-200 bg-white/60 rounded-lg flex items-center justify-center">
        <span className="text-[8px] text-neutral-400 text-center leading-tight px-1">
          {side === 'university' ? 'Uni' : 'College'}<br />Logo
        </span>
      </div>
    )}
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(side, e)} />
  </div>
);

const InfoBar: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const { header } = usePosterStore();
  const parts: string[] = [];
  if (header.showStudentInfo && header.studentName) {
    parts.push(`${header.studentName}${header.studentId ? ` (${header.studentId})` : ''}`);
  }
  if (header.showSupervisor && header.supervisorName) parts.push(`Supervisor: ${header.supervisorName}`);
  if (header.showReader     && header.readerName)      parts.push(`Reader: ${header.readerName}`);
  if (header.showDepartment && header.department)      parts.push(header.department);
  if (header.institution) parts.push(header.institution);
  if (header.year)        parts.push(header.year);

  if (parts.length === 0) return null;

  return (
    <div
      className="inline-flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-sm font-medium text-neutral-700 py-1 px-4 rounded-full border"
      style={{ backgroundColor: primaryColor + '12', borderColor: primaryColor + '30' }}
    >
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: primaryColor + '50' }}>|</span>}
          <span>{p}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

const PosterHeader: React.FC = () => {
  const { header, theme, updateHeader } = usePosterStore();
  const uniRef  = useRef<HTMLInputElement>(null);
  const collRef = useRef<HTMLInputElement>(null);

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

  const titleCls = `font-bold uppercase tracking-tight text-neutral-800 leading-snug ${TITLE_CLASS[header.titleSize] ?? 'text-xl'}`;

  // ─── Academic (default) ────────────────────────────────────────────────────
  if (header.headerLayout === 'academic') {
    return (
      <div
        className="w-full flex items-center justify-between gap-6 px-10 py-3 border-b-[4px]"
        style={{ borderColor: theme.primaryColor }}
      >
        <LogoSlot url={header.universityLogoUrl} side="university" onUpload={handleLogo} inputRef={uniRef} />
        <div className="flex-1 text-center flex flex-col items-center">
          <h1 className={titleCls}>{header.projectTitle || 'Your Project Title'}</h1>
          <InfoBar primaryColor={theme.primaryColor} />
        </div>
        <LogoSlot url={header.collegeLogoUrl} side="college" onUpload={handleLogo} inputRef={collRef} className="justify-end" />
      </div>
    );
  }

  // ─── Banner (solid colour background) ─────────────────────────────────────
  if (header.headerLayout === 'banner') {
    return (
      <div
        className="w-full px-10 py-4"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="flex items-center justify-between gap-6">
          <LogoSlot url={header.universityLogoUrl} side="university" onUpload={handleLogo} inputRef={uniRef} className="[&_img]:brightness-0 [&_img]:invert [&_div]:border-white/30 [&_div]:bg-white/10 [&_span]:text-white/60" />
          <div className="flex-1 text-center flex flex-col items-center">
            <h1 className={`${TITLE_CLASS[header.titleSize] ?? 'text-xl'} font-bold uppercase tracking-tight text-white leading-snug`}>
              {header.projectTitle || 'Your Project Title'}
            </h1>
            {(() => {
              const parts: string[] = [];
              if (header.showStudentInfo && header.studentName) parts.push(`${header.studentName}${header.studentId ? ` (${header.studentId})` : ''}`);
              if (header.showSupervisor && header.supervisorName) parts.push(`Supervisor: ${header.supervisorName}`);
              if (header.showReader     && header.readerName)     parts.push(`Reader: ${header.readerName}`);
              if (header.showDepartment && header.department)     parts.push(header.department);
              if (header.institution) parts.push(header.institution);
              if (header.year)        parts.push(header.year);
              if (parts.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-x-4 mt-1.5 text-sm text-white/80 font-medium justify-center">
                  {parts.map((p, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <span className="text-white/30">|</span>}
                      <span>{p}</span>
                    </React.Fragment>
                  ))}
                </div>
              );
            })()}
          </div>
          <LogoSlot url={header.collegeLogoUrl} side="college" onUpload={handleLogo} inputRef={collRef} className="justify-end [&_img]:brightness-0 [&_img]:invert [&_div]:border-white/30 [&_div]:bg-white/10 [&_span]:text-white/60" />
        </div>
      </div>
    );
  }

  // ─── Centred (logos above, title below) ────────────────────────────────────
  if (header.headerLayout === 'centered') {
    return (
      <div
        className="w-full flex flex-col items-center text-center px-10 py-3 gap-2 border-b-[4px]"
        style={{ borderColor: theme.primaryColor }}
      >
        <div className="flex items-center gap-6">
          <LogoSlot url={header.universityLogoUrl} side="university" onUpload={handleLogo} inputRef={uniRef} />
          <LogoSlot url={header.collegeLogoUrl}    side="college"    onUpload={handleLogo} inputRef={collRef} />
        </div>
        <h1 className={titleCls}>{header.projectTitle || 'Your Project Title'}</h1>
        <InfoBar primaryColor={theme.primaryColor} />
      </div>
    );
  }

  // ─── Minimal (title only) ──────────────────────────────────────────────────
  return (
    <div
      className="w-full flex flex-col items-center text-center px-10 py-4 border-b-[3px]"
      style={{ borderColor: theme.primaryColor }}
    >
      <h1 className={titleCls}>{header.projectTitle || 'Your Project Title'}</h1>
      <InfoBar primaryColor={theme.primaryColor} />
    </div>
  );
};

export default PosterHeader;
