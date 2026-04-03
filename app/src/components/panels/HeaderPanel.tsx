import React, { useRef } from 'react';
import { usePosterStore, type HeaderLayout } from '../../store/usePosterStore';
import { Eye, EyeOff } from 'lucide-react';

const LAYOUTS: { id: HeaderLayout; label: string; description: string }[] = [
  { id: 'academic',  label: 'Academic',  description: 'Logos on sides, title + info centred' },
  { id: 'banner',    label: 'Banner',    description: 'Solid colour background, white text' },
  { id: 'centered',  label: 'Centred',   description: 'Logos above, title below' },
  { id: 'minimal',   label: 'Minimal',   description: 'Title only, no logos' },
];

type InfoLayout = 'inline' | 'stacked' | 'two-row' | 'grid';

const INFO_LAYOUTS: { id: InfoLayout; label: string; description: string; preview: React.ReactNode }[] = [
  {
    id: 'inline',
    label: 'Inline',
    description: 'All fields in one row',
    preview: (
      <div className="text-[8px] leading-tight text-center truncate opacity-70">
        Name · Supervisor · Reader
      </div>
    ),
  },
  {
    id: 'stacked',
    label: 'Stacked',
    description: 'Each field on its own row',
    preview: (
      <div className="text-[7px] leading-snug opacity-70 space-y-px">
        <div className="flex gap-1"><span className="font-bold">STUDENT:</span><span>Name (ID)</span></div>
        <div className="flex gap-1"><span className="font-bold">SUPERVISOR:</span><span>Name</span></div>
        <div className="flex gap-1"><span className="font-bold">READER:</span><span>Name</span></div>
      </div>
    ),
  },
  {
    id: 'two-row',
    label: '2-Row',
    description: 'Name on top, others below',
    preview: (
      <div className="text-[7px] leading-snug opacity-70 text-center space-y-0.5">
        <div className="font-semibold">Name (Student ID)</div>
        <div className="text-[6px]">Supervisor · Reader</div>
      </div>
    ),
  },
  {
    id: 'grid',
    label: 'Grid',
    description: '2-column label / value',
    preview: (
      <div className="text-[7px] leading-snug opacity-70 grid gap-x-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <span className="font-bold">STUDENT</span><span>Name</span>
        <span className="font-bold">SUPERVISOR</span><span>Name</span>
        <span className="font-bold">READER</span><span>Name</span>
      </div>
    ),
  },
];

const HeaderPanel: React.FC = () => {
  const { header, updateHeader } = usePosterStore();
  const uniLogoRef  = useRef<HTMLInputElement>(null);
  const collLogoRef = useRef<HTMLInputElement>(null);

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

  const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
        value
          ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
          : 'border-neutral-200 bg-white text-neutral-400 line-through'
      }`}
    >
      {value ? <Eye size={11} /> : <EyeOff size={11} />}
      {label}
    </button>
  );

  const titleFontSize  = header.titleFontSize  ?? 32;
  const headerPadding  = header.headerPadding  ?? 12;
  const infoFontSize   = header.infoFontSize   ?? 12;
  const infoLayout     = header.infoLayout     ?? 'inline';

  return (
    <div className="space-y-5 p-4">

      {/* Layout presets */}
      <div>
        <label className={labelClass}>Header Layout</label>
        <div className="grid grid-cols-2 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => updateHeader({ headerLayout: l.id })}
              title={l.description}
              className={`flex flex-col items-start px-3 py-2 rounded-lg border-2 text-left transition-all ${
                header.headerLayout === l.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span className="text-sm font-semibold text-neutral-800">{l.label}</span>
              <span className="text-[9px] text-neutral-400 leading-tight mt-0.5">{l.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Header sizing */}
      <div>
        <label className={labelClass}>Header Sizing</label>
        <div className="space-y-2">
          {/* Title font size */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-neutral-400 uppercase w-16 shrink-0">Title</span>
            <input
              type="range" min="16" max="80" step="1"
              value={titleFontSize}
              onChange={(e) => updateHeader({ titleFontSize: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-600 h-1.5"
            />
            <span className="text-xs text-neutral-700 font-semibold w-10 text-right tabular-nums shrink-0">
              {titleFontSize}px
            </span>
          </div>
          {/* Header vertical padding */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-neutral-400 uppercase w-16 shrink-0">Height</span>
            <input
              type="range" min="4" max="48" step="2"
              value={headerPadding}
              onChange={(e) => updateHeader({ headerPadding: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-600 h-1.5"
            />
            <span className="text-xs text-neutral-700 font-semibold w-10 text-right tabular-nums shrink-0">
              {headerPadding}px
            </span>
          </div>
          {/* Info text size */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-neutral-400 uppercase w-16 shrink-0">Info text</span>
            <input
              type="range" min="8" max="18" step="1"
              value={infoFontSize}
              onChange={(e) => updateHeader({ infoFontSize: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-600 h-1.5"
            />
            <span className="text-xs text-neutral-700 font-semibold w-10 text-right tabular-nums shrink-0">
              {infoFontSize}px
            </span>
          </div>
        </div>
      </div>

      {/* Info layout templates */}
      <div>
        <label className={labelClass}>Info Bar Layout</label>
        <div className="grid grid-cols-2 gap-2">
          {INFO_LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => updateHeader({ infoLayout: l.id })}
              className={`flex flex-col items-start px-2.5 py-2 rounded-lg border-2 text-left transition-all min-h-[56px] ${
                infoLayout === l.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <span className="text-[10px] font-bold text-neutral-700 mb-1">{l.label}</span>
              {l.preview}
            </button>
          ))}
        </div>
        <p className="text-[9px] text-neutral-400 mt-1.5 leading-snug">
          {INFO_LAYOUTS.find((l) => l.id === infoLayout)?.description}
        </p>
      </div>

      {/* Logo uploads — hidden for minimal layout */}
      {header.headerLayout !== 'minimal' && (
        <div>
          <label className={labelClass}>Logos</label>
          <div className="grid grid-cols-2 gap-3">
            {/* University logo */}
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase mb-1">University</p>
              {header.universityLogoUrl ? (
                <div className="relative">
                  <img src={header.universityLogoUrl} alt="University Logo" className="w-full h-14 object-contain border border-neutral-200 rounded-md bg-neutral-50" />
                  <button
                    onClick={() => updateHeader({ universityLogoUrl: null })}
                    className="absolute top-1 right-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded leading-none"
                  >×</button>
                </div>
              ) : (
                <button
                  onClick={() => uniLogoRef.current?.click()}
                  className="w-full h-14 border-2 border-dashed border-neutral-300 rounded-md text-[10px] text-neutral-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                >
                  + Upload
                </button>
              )}
              <input ref={uniLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo('university', e)} />
            </div>

            {/* College logo */}
            <div>
              <p className="text-[9px] text-neutral-400 font-bold uppercase mb-1">College</p>
              {header.collegeLogoUrl ? (
                <div className="relative">
                  <img src={header.collegeLogoUrl} alt="College Logo" className="w-full h-14 object-contain border border-neutral-200 rounded-md bg-neutral-50" />
                  <button
                    onClick={() => updateHeader({ collegeLogoUrl: null })}
                    className="absolute top-1 right-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded leading-none"
                  >×</button>
                </div>
              ) : (
                <button
                  onClick={() => collLogoRef.current?.click()}
                  className="w-full h-14 border-2 border-dashed border-neutral-300 rounded-md text-[10px] text-neutral-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                >
                  + Upload
                </button>
              )}
              <input ref={collLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo('college', e)} />
            </div>
          </div>
        </div>
      )}

      {/* Project title */}
      <div>
        <label className={labelClass}>Project Title</label>
        <input
          type="text"
          value={header.projectTitle}
          onChange={(e) => updateHeader({ projectTitle: e.target.value })}
          className={inputClass + ' font-medium'}
          placeholder="Your Project Title"
        />
      </div>

      {/* Visibility toggles */}
      <div>
        <label className={labelClass}>Show / Hide Fields</label>
        <div className="flex flex-wrap gap-2">
          <Toggle label="Student Info" value={header.showStudentInfo} onChange={(v) => updateHeader({ showStudentInfo: v })} />
          <Toggle label="Supervisor"   value={header.showSupervisor}  onChange={(v) => updateHeader({ showSupervisor: v })} />
          <Toggle label="Reader"       value={header.showReader}      onChange={(v) => updateHeader({ showReader: v })} />
          <Toggle label="Department"   value={header.showDepartment}  onChange={(v) => updateHeader({ showDepartment: v })} />
        </div>
      </div>

      {/* Student info */}
      {header.showStudentInfo && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Student Name</label>
            <input type="text" value={header.studentName} onChange={(e) => updateHeader({ studentName: e.target.value })} className={inputClass} placeholder="Your Full Name" />
          </div>
          <div>
            <label className={labelClass}>Student ID</label>
            <input type="text" value={header.studentId} onChange={(e) => updateHeader({ studentId: e.target.value })} className={inputClass} placeholder="ID Number" />
          </div>
        </div>
      )}

      {/* Supervisor + Reader */}
      <div className="grid grid-cols-2 gap-3">
        {header.showSupervisor && (
          <div>
            <label className={labelClass}>Supervisor</label>
            <input type="text" value={header.supervisorName} onChange={(e) => updateHeader({ supervisorName: e.target.value })} className={inputClass} placeholder="Supervisor Name" />
          </div>
        )}
        {header.showReader && (
          <div>
            <label className={labelClass}>Reader</label>
            <input type="text" value={header.readerName} onChange={(e) => updateHeader({ readerName: e.target.value })} className={inputClass} placeholder="Reader Name" />
          </div>
        )}
      </div>

      {/* Extra fields */}
      <div className="space-y-3 pt-2 border-t border-neutral-100">
        <label className={labelClass}>Extra Details</label>

        {header.showDepartment && (
          <div>
            <label className={labelClass}>Department</label>
            <input type="text" value={header.department} onChange={(e) => updateHeader({ department: e.target.value })} className={inputClass} placeholder="e.g. School of Computing" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Institution</label>
            <input type="text" value={header.institution} onChange={(e) => updateHeader({ institution: e.target.value })} className={inputClass} placeholder="University Name" />
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <input type="text" value={header.year} onChange={(e) => updateHeader({ year: e.target.value })} className={inputClass} placeholder="2025–2026" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default HeaderPanel;
