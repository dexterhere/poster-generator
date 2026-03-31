import React, { useRef } from 'react';
import { usePosterStore } from '../../store/usePosterStore';

const HeaderPanel: React.FC = () => {
  const { header, updateHeader } = usePosterStore();
  const uniLogoRef = useRef<HTMLInputElement>(null);
  const collegeLogoRef = useRef<HTMLInputElement>(null);

  const inputClass = "w-full border border-neutral-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";
  const labelClass = "block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5";

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
    <div className="space-y-5 p-4">
      {/* Logo uploads */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>University Logo</label>
          {header.universityLogoUrl ? (
            <div className="relative">
              <img src={header.universityLogoUrl} alt="University Logo" className="w-full h-16 object-contain border border-neutral-200 rounded-md bg-neutral-50" />
              <button
                onClick={() => updateHeader({ universityLogoUrl: null })}
                className="absolute top-1 right-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded"
              >Remove</button>
            </div>
          ) : (
            <button
              onClick={() => uniLogoRef.current?.click()}
              className="w-full h-16 border-2 border-dashed border-neutral-300 rounded-md text-[11px] text-neutral-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
            >
              + Upload Logo
            </button>
          )}
          <input ref={uniLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo('university', e)} />
        </div>
        <div>
          <label className={labelClass}>College Logo</label>
          {header.collegeLogoUrl ? (
            <div className="relative">
              <img src={header.collegeLogoUrl} alt="College Logo" className="w-full h-16 object-contain border border-neutral-200 rounded-md bg-neutral-50" />
              <button
                onClick={() => updateHeader({ collegeLogoUrl: null })}
                className="absolute top-1 right-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded"
              >Remove</button>
            </div>
          ) : (
            <button
              onClick={() => collegeLogoRef.current?.click()}
              className="w-full h-16 border-2 border-dashed border-neutral-300 rounded-md text-[11px] text-neutral-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
            >
              + Upload Logo
            </button>
          )}
          <input ref={collegeLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo('college', e)} />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className={labelClass}>Project Title</label>
        <input
          type="text"
          value={header.projectTitle}
          onChange={(e) => updateHeader({ projectTitle: e.target.value })}
          className={inputClass + ' font-medium'}
        />
      </div>

      {/* Academic Question */}
      <div>
        <label className={labelClass}>Academic Question / Subtitle</label>
        <input
          type="text"
          value={header.academicQuestion}
          onChange={(e) => updateHeader({ academicQuestion: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Name + ID */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Student Name</label>
          <input type="text" value={header.studentName} onChange={(e) => updateHeader({ studentName: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Student ID</label>
          <input type="text" value={header.studentId} onChange={(e) => updateHeader({ studentId: e.target.value })} className={inputClass} />
        </div>
      </div>

      {/* Supervisor + Reader */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Supervisor</label>
          <input type="text" value={header.supervisorName} onChange={(e) => updateHeader({ supervisorName: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Reader</label>
          <input type="text" value={header.readerName} onChange={(e) => updateHeader({ readerName: e.target.value })} className={inputClass} />
        </div>
      </div>
    </div>
  );
};

export default HeaderPanel;
