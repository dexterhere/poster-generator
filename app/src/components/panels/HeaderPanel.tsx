import React, { useRef } from 'react';
import { usePosterStore, type HeaderLayout } from '../../store/usePosterStore';
import { Eye, EyeOff, X } from 'lucide-react';

const LAYOUTS: { id: HeaderLayout; label: string; description: string }[] = [
  { id: 'academic', label: 'Academic', description: 'Logos on sides with centered title' },
  { id: 'minimal', label: 'Minimal', description: 'Title and info only' },
  { id: 'banner', label: 'Banner', description: 'Solid band with logos' },
  { id: 'centered', label: 'Centered', description: 'Logos above title' },
  { id: 'split', label: 'Split', description: 'Title left, identity right' },
  { id: 'modern', label: 'Modern', description: 'Clean accent line' },
  { id: 'corporate', label: 'Corporate', description: 'Structured title block' },
  { id: 'classic', label: 'Classic', description: 'Traditional serif frame' },
  { id: 'bold', label: 'Bold', description: 'Large title emphasis' },
  { id: 'simple-line', label: 'Line', description: 'Compact line header' },
  { id: 'two-column', label: '2 Column', description: 'Logo/title and metadata columns' },
  { id: 'logo-dominant', label: 'Logo Lead', description: 'Larger logo row' },
  { id: 'text-dominant', label: 'Text Lead', description: 'Maximum title width' },
  { id: 'underline-accent', label: 'Underline', description: 'Accent underline style' },
  { id: 'framed', label: 'Framed', description: 'Inset frame around header' },
  { id: 'pill-badge', label: 'Badge', description: 'Rounded metadata badge' },
  { id: 'dark-band', label: 'Dark Band', description: 'High contrast band' },
  { id: 'sidebar-left', label: 'Left Rail', description: 'Left vertical accent' },
  { id: 'sidebar-right', label: 'Right Rail', description: 'Right vertical accent' },
];

type InfoLayout = 'inline' | 'stacked' | 'two-row' | 'grid';

const INFO_LAYOUTS: { id: InfoLayout; label: string; description: string; preview: React.ReactNode }[] = [
  {
    id: 'inline',
    label: 'Inline',
    description: 'All fields in one row',
    preview: (
      <div className="text-[8px] leading-tight text-center truncate opacity-60">
        Name · Supervisor · Reader
      </div>
    ),
  },
  {
    id: 'stacked',
    label: 'Stacked',
    description: 'Each field on its own row',
    preview: (
      <div className="text-[7px] leading-snug opacity-60 space-y-px">
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
      <div className="text-[7px] leading-snug opacity-60 text-center space-y-0.5">
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
      <div className="text-[7px] leading-snug opacity-60 grid gap-x-2" style={{ gridTemplateColumns: 'auto 1fr' }}>
        <span className="font-bold">STUDENT</span><span>Name</span>
        <span className="font-bold">SUPERVISOR</span><span>Name</span>
        <span className="font-bold">READER</span><span>Name</span>
      </div>
    ),
  },
];

const HeaderFieldToggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
      value
        ? 'border-indigo-400/30 bg-indigo-500/15 text-indigo-300'
        : 'border-white/10 bg-white/5 text-white/30 line-through'
    }`}
  >
    {value ? <Eye size={11} /> : <EyeOff size={11} />}
    {label}
  </button>
);

const HeaderPanel: React.FC = () => {
  const { header, theme, updateHeader, updateTheme } = usePosterStore();
  const uniLogoRef  = useRef<HTMLInputElement>(null);
  const collLogoRef = useRef<HTMLInputElement>(null);

  const inputClass = "glass-input w-full rounded-lg px-3 py-2 text-sm";
  const labelClass = "block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-1.5";

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

  const titleFontSize  = header.titleFontSize  ?? 32;
  const headerPadding  = header.headerPadding  ?? 12;
  const infoFontSize   = header.infoFontSize   ?? 12;
  const infoLayout     = header.infoLayout     ?? 'inline';

  return (
    <div className="space-y-5 p-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
        <div>
          <p className="text-xs font-semibold text-white/80">Poster Header</p>
          <p className="text-[10px] text-white/35">Enable this only when your poster needs a title block.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={theme.headerEnabled !== false}
            onChange={(e) => updateTheme({ headerEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500/70" />
        </label>
      </div>

      {/* Layout presets */}
      <div className={theme.headerEnabled === false ? 'opacity-45 pointer-events-none' : ''}>
        <label className={labelClass}>Header Layout</label>
        <div className="grid grid-cols-2 gap-2">
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => updateHeader({ headerLayout: l.id })}
              title={l.description}
              className={`flex flex-col items-start px-3 py-2 rounded-lg border text-left transition-all ${
                header.headerLayout === l.id
                  ? 'border-indigo-400/40 bg-indigo-500/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <span className="text-sm font-semibold text-white/80">{l.label}</span>
              <span className="text-[9px] text-white/40 leading-tight mt-0.5">{l.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Header sizing */}
      <div>
        <label className={labelClass}>Header Sizing</label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-16 shrink-0">Title</span>
            <input
              type="range" min="16" max="80" step="1"
              value={titleFontSize}
              onChange={(e) => updateHeader({ titleFontSize: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-10 text-right tabular-nums shrink-0">
              {titleFontSize}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-16 shrink-0">Height</span>
            <input
              type="range" min="4" max="48" step="2"
              value={headerPadding}
              onChange={(e) => updateHeader({ headerPadding: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-10 text-right tabular-nums shrink-0">
              {headerPadding}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-semibold text-white/30 uppercase w-16 shrink-0">Info text</span>
            <input
              type="range" min="8" max="18" step="1"
              value={infoFontSize}
              onChange={(e) => updateHeader({ infoFontSize: parseInt(e.target.value) })}
              className="flex-1 accent-indigo-500 h-1.5 bg-white/10 rounded-lg appearance-none"
            />
            <span className="text-xs text-white/60 font-semibold w-10 text-right tabular-nums shrink-0">
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
              className={`flex flex-col items-start px-2.5 py-2 rounded-lg border text-left transition-all min-h-[56px] ${
                infoLayout === l.id
                  ? 'border-indigo-400/40 bg-indigo-500/10'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              <span className="text-[10px] font-bold text-white/70 mb-1">{l.label}</span>
              {l.preview}
            </button>
          ))}
        </div>
      </div>

      {/* Logo uploads */}
      {header.headerLayout !== 'minimal' && (
        <div>
          <label className={labelClass}>Logos</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] text-white/30 font-semibold uppercase mb-1">University</p>
              {header.universityLogoUrl ? (
                <div className="relative">
                  <img src={header.universityLogoUrl} alt="University Logo" className="w-full h-14 object-contain border border-white/10 rounded-lg bg-white/5" />
                  <button
                    onClick={() => updateHeader({ universityLogoUrl: null })}
                    className="absolute top-1 right-1 bg-red-500/80 text-white p-0.5 rounded leading-none hover:bg-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => uniLogoRef.current?.click()}
                  className="w-full h-14 border-2 border-dashed border-white/10 rounded-lg text-[10px] text-white/30 hover:border-indigo-400/40 hover:text-indigo-300 transition-colors"
                >
                  + Upload
                </button>
              )}
              <input ref={uniLogoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleLogo('university', e)} />
            </div>

            <div>
              <p className="text-[9px] text-white/30 font-semibold uppercase mb-1">College</p>
              {header.collegeLogoUrl ? (
                <div className="relative">
                  <img src={header.collegeLogoUrl} alt="College Logo" className="w-full h-14 object-contain border border-white/10 rounded-lg bg-white/5" />
                  <button
                    onClick={() => updateHeader({ collegeLogoUrl: null })}
                    className="absolute top-1 right-1 bg-red-500/80 text-white p-0.5 rounded leading-none hover:bg-red-500 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => collLogoRef.current?.click()}
                  className="w-full h-14 border-2 border-dashed border-white/10 rounded-lg text-[10px] text-white/30 hover:border-indigo-400/40 hover:text-indigo-300 transition-colors"
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
          <HeaderFieldToggle label="Student Info" value={header.showStudentInfo} onChange={(v) => updateHeader({ showStudentInfo: v })} />
          <HeaderFieldToggle label="Supervisor"   value={header.showSupervisor}  onChange={(v) => updateHeader({ showSupervisor: v })} />
          <HeaderFieldToggle label="Reader"       value={header.showReader}      onChange={(v) => updateHeader({ showReader: v })} />
          <HeaderFieldToggle label="Department"   value={header.showDepartment}  onChange={(v) => updateHeader({ showDepartment: v })} />
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
      <div className="space-y-3 pt-2 border-t border-white/10">
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
            <input type="text" value={header.year} onChange={(e) => updateHeader({ year: e.target.value })} className={inputClass} placeholder="2025-2026" />
          </div>
        </div>
      </div>

    </div>
  );
};

export default HeaderPanel;
