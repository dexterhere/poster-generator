import React, { useRef } from 'react';
import { usePosterStore, type HeaderLayout } from '../../store/usePosterStore';
import { Eye, EyeOff } from 'lucide-react';

const LAYOUTS: { id: HeaderLayout; label: string; description: string }[] = [
  { id: 'academic',  label: 'Academic',  description: 'Logos on sides, title + info centred' },
  { id: 'banner',    label: 'Banner',    description: 'Solid colour background, white text' },
  { id: 'centered',  label: 'Centred',   description: 'Logos above, title below' },
  { id: 'minimal',   label: 'Minimal',   description: 'Title only, no logos' },
];

const TITLE_SIZES = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
] as const;

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

      {/* Title size */}
      <div>
        <label className={labelClass}>Title Size</label>
        <div className="flex gap-1">
          {TITLE_SIZES.map((s) => (
            <button
              key={s.value}
              onClick={() => updateHeader({ titleSize: s.value })}
              className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-all border ${
                header.titleSize === s.value
                  ? 'border-indigo-500 bg-indigo-500 text-white'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
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
