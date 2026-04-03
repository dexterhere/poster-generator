import React, { useRef } from 'react';
import { usePosterStore } from '../../store/usePosterStore';
import { hexOpacity } from '../../utils/colorUtils';

// ─── Shared InfoBar ────────────────────────────────────────────────────────────
// Renders student/supervisor/reader info according to the chosen infoLayout.
// isWhite=true switches all colours to white variants (used by the Banner header).

const InfoBar: React.FC<{ primaryColor: string; isWhite?: boolean; fontSize: number }> = ({
  primaryColor,
  isWhite = false,
  fontSize,
}) => {
  const { header } = usePosterStore();

  const studentName = header.showStudentInfo && header.studentName ? header.studentName : null;
  const studentId   = header.showStudentInfo && header.studentId   ? header.studentId   : null;

  const supervisor  = header.showSupervisor && header.supervisorName ? header.supervisorName : null;
  const reader      = header.showReader     && header.readerName     ? header.readerName     : null;
  const dept        = header.showDepartment && header.department     ? header.department     : null;
  const institution = header.institution || null;
  const year        = header.year        || null;

  if (!studentName && !studentId && !supervisor && !reader && !dept && !institution && !year) return null;

  // Colour tokens
  const textColor   = isWhite ? 'rgba(255,255,255,0.90)' : undefined;
  const accentColor = isWhite ? 'rgba(255,255,255,0.55)' : hexOpacity(primaryColor, 80);
  const labelColor  = isWhite ? 'rgba(255,255,255,0.60)' : hexOpacity(primaryColor, 80);
  const bgColor     = isWhite ? 'rgba(255,255,255,0.15)' : hexOpacity(primaryColor, 18);
  const borderColor = isWhite ? 'rgba(255,255,255,0.30)' : hexOpacity(primaryColor, 48);

  const layout = header.infoLayout ?? 'inline';
  const fs = fontSize;

  // ── Stacked: each field on its own labeled row ──────────────────────────────
  if (layout === 'stacked') {
    const rows: { label: string; value: string }[] = [
      studentName  && { label: 'Name',       value: studentName  },
      studentId    && { label: 'Student ID', value: studentId    },
      supervisor   && { label: 'Supervisor', value: supervisor   },
      reader       && { label: 'Reader',     value: reader       },
      dept         && { label: 'Department', value: dept         },
      institution  && { label: 'Institution',value: institution  },
      year         && { label: 'Year',       value: year         },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
      <div className="mt-2 flex flex-col items-center gap-0.5">
        {rows.map((row, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span className="font-bold uppercase tracking-wider shrink-0" style={{ color: labelColor, fontSize: fs * 0.85 }}>
              {row.label}:
            </span>
            <span className="font-medium" style={{ color: textColor, fontSize: fs }}>{row.value}</span>
          </div>
        ))}
      </div>
    );
  }

  // ── 2-Row: name/ID prominent on top, supervisor/reader bold-colored below ────
  if (layout === 'two-row') {
    // Structured entries: supervisor and reader get bold primary-color treatment.
    // Dept / institution / year fall back to muted accent.
    type SecondRowEntry =
      | { kind: 'bold'; label: string; value: string }
      | { kind: 'plain'; value: string };

    const secondRow: SecondRowEntry[] = [
      supervisor  ? { kind: 'bold',  label: 'Supervisor', value: supervisor  } : null,
      reader      ? { kind: 'bold',  label: 'Reader',     value: reader      } : null,
      dept        ? { kind: 'plain', value: dept        } : null,
      institution ? { kind: 'plain', value: institution } : null,
      year        ? { kind: 'plain', value: year        } : null,
    ].filter(Boolean) as SecondRowEntry[];

    const boldColor  = isWhite ? 'rgba(255,255,255,0.95)' : primaryColor;
    const plainColor = isWhite ? 'rgba(255,255,255,0.70)' : '#374151'; // neutral-700

    return (
      <div className="mt-2 flex flex-col items-center gap-0.5">
        {(studentName || studentId) && (
          <div className="flex items-baseline gap-3" style={{ fontSize: fs }}>
            {studentName && (
              <span className="font-bold" style={{ color: boldColor }}>
                <span className="font-bold uppercase tracking-wider" style={{ fontSize: fs * 0.85 }}>Name: </span>
                <span className="font-semibold">{studentName}</span>
              </span>
            )}
            {studentName && studentId && <span style={{ color: accentColor, fontSize: fs * 0.8 }}>·</span>}
            {studentId && (
              <span className="font-bold" style={{ color: boldColor }}>
                <span className="font-bold uppercase tracking-wider" style={{ fontSize: fs * 0.85 }}>ID: </span>
                <span className="font-semibold">{studentId}</span>
              </span>
            )}
          </div>
        )}
        {secondRow.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-3 items-baseline" style={{ fontSize: fs }}>
            {secondRow.map((entry, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span style={{ color: accentColor, fontSize: fs * 0.8 }}>·</span>}
                {entry.kind === 'bold' ? (
                  <span className="font-bold" style={{ color: boldColor }}>
                    {entry.label}:{' '}
                    <span className="font-semibold" style={{ color: boldColor }}>{entry.value}</span>
                  </span>
                ) : (
                  <span style={{ color: plainColor }}>{entry.value}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Grid: 2-column label | value table ─────────────────────────────────────
  if (layout === 'grid') {
    const rows: { label: string; value: string }[] = [
      studentName  && { label: 'Name',       value: studentName  },
      studentId    && { label: 'Student ID', value: studentId    },
      supervisor   && { label: 'Supervisor', value: supervisor   },
      reader       && { label: 'Reader',     value: reader       },
      dept         && { label: 'Department', value: dept         },
      institution  && { label: 'Institution',value: institution  },
      year         && { label: 'Year',       value: year         },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
      <div className="mt-2 grid gap-x-5 gap-y-0.5" style={{ gridTemplateColumns: 'auto 1fr', fontSize: fs }}>
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <span className="font-bold uppercase tracking-wide text-right shrink-0" style={{ color: labelColor, fontSize: fs * 0.85 }}>
              {row.label}
            </span>
            <span className="font-medium" style={{ color: textColor }}>{row.value}</span>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // ── Inline (default): all fields in one pill separated by | ────────────────
  const studentEntry = studentName
    ? `Name: ${studentName}${studentId ? `  ·  ID: ${studentId}` : ''}`
    : studentId ? `ID: ${studentId}` : null;

  const parts = [
    studentEntry,
    supervisor  && `Supervisor: ${supervisor}`,
    reader      && `Reader: ${reader}`,
    dept,
    institution,
    year,
  ].filter(Boolean) as string[];

  return (
    <div
      className="inline-flex flex-wrap gap-x-4 gap-y-0.5 mt-2 font-medium py-1 px-4 rounded-full border"
      style={{ backgroundColor: bgColor, borderColor, color: textColor, fontSize: fs }}
    >
      {parts.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span style={{ color: accentColor }}>|</span>}
          <span>{p}</span>
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Logo slot ─────────────────────────────────────────────────────────────────
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

// ─── PosterHeader ──────────────────────────────────────────────────────────────
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

  const titleFontSize  = header.titleFontSize  ?? 32;
  const headerPadding  = header.headerPadding  ?? 12;
  const infoFontSize   = header.infoFontSize   ?? 12;

  const titleBaseClass = 'font-bold uppercase tracking-tight leading-tight poster-title';
  const vPad = { paddingTop: headerPadding, paddingBottom: headerPadding };

  // ─── Academic ─────────────────────────────────────────────────────────────
  if (header.headerLayout === 'academic') {
    return (
      <div
        className="w-full flex items-center justify-between gap-6 px-10 border-b-2"
        style={{ borderColor: theme.primaryColor, ...vPad }}
      >
        <LogoSlot url={header.universityLogoUrl} side="university" onUpload={handleLogo} inputRef={uniRef} />
        <div className="flex-1 text-center flex flex-col items-center">
          <h1 className={`${titleBaseClass} text-neutral-800`} style={{ fontSize: titleFontSize }}>
            {header.projectTitle || 'Your Project Title'}
          </h1>
          <InfoBar primaryColor={theme.primaryColor} fontSize={infoFontSize} />
        </div>
        <LogoSlot url={header.collegeLogoUrl} side="college" onUpload={handleLogo} inputRef={collRef} className="justify-end" />
      </div>
    );
  }

  // ─── Banner ───────────────────────────────────────────────────────────────
  if (header.headerLayout === 'banner') {
    return (
      <div className="w-full px-10" style={{ backgroundColor: theme.primaryColor, ...vPad }}>
        <div className="flex items-center justify-between gap-6">
          <LogoSlot
            url={header.universityLogoUrl} side="university"
            onUpload={handleLogo} inputRef={uniRef}
            className="[&_img]:brightness-0 [&_img]:invert [&_div]:border-white/30 [&_div]:bg-white/10 [&_span]:text-white/60"
          />
          <div className="flex-1 text-center flex flex-col items-center">
            <h1 className={`${titleBaseClass} text-white`} style={{ fontSize: titleFontSize }}>
              {header.projectTitle || 'Your Project Title'}
            </h1>
            <InfoBar primaryColor={theme.primaryColor} isWhite fontSize={infoFontSize} />
          </div>
          <LogoSlot
            url={header.collegeLogoUrl} side="college"
            onUpload={handleLogo} inputRef={collRef}
            className="justify-end [&_img]:brightness-0 [&_img]:invert [&_div]:border-white/30 [&_div]:bg-white/10 [&_span]:text-white/60"
          />
        </div>
      </div>
    );
  }

  // ─── Centred ──────────────────────────────────────────────────────────────
  if (header.headerLayout === 'centered') {
    return (
      <div
        className="w-full flex flex-col items-center text-center px-10 gap-2 border-b-2"
        style={{ borderColor: theme.primaryColor, ...vPad }}
      >
        <div className="flex items-center gap-6">
          <LogoSlot url={header.universityLogoUrl} side="university" onUpload={handleLogo} inputRef={uniRef} />
          <LogoSlot url={header.collegeLogoUrl}    side="college"    onUpload={handleLogo} inputRef={collRef} />
        </div>
        <h1 className={`${titleBaseClass} text-neutral-800`} style={{ fontSize: titleFontSize }}>
          {header.projectTitle || 'Your Project Title'}
        </h1>
        <InfoBar primaryColor={theme.primaryColor} fontSize={infoFontSize} />
      </div>
    );
  }

  // ─── Minimal ──────────────────────────────────────────────────────────────
  return (
    <div
      className="w-full flex flex-col items-center text-center px-10 border-b-2"
      style={{ borderColor: theme.primaryColor, ...vPad }}
    >
      <h1 className={`${titleBaseClass} text-neutral-800`} style={{ fontSize: titleFontSize }}>
        {header.projectTitle || 'Your Project Title'}
      </h1>
      <InfoBar primaryColor={theme.primaryColor} fontSize={infoFontSize} />
    </div>
  );
};

export default PosterHeader;
