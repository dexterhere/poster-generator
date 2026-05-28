import React from 'react';
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  MoveHorizontal,
  Type,
  Bold,
  Italic,
  CaseUpper,
  Square,
  Lock,
  Unlock,
} from 'lucide-react';
import { usePosterStore } from '../../store/usePosterStore';
import type { SectionStyle } from '../../store/usePosterStore';

const FloatingSectionToolbar: React.FC = () => {
  const {
    sections,
    selectedSectionId,
    selectedSectionIds,
    layout,
    theme,
    updateSection,
    addSection,
    deleteSection,
  } = usePosterStore();

  const selectedSections = sections.filter((s) => selectedSectionIds.includes(s.id));
  const section = selectedSections.length === 1
    ? selectedSections[0]
    : sections.find((s) => s.id === selectedSectionId);
  if (selectedSections.length === 0 || !section) return null;
  const isMulti = selectedSections.length > 1;
  const allLocked = selectedSections.every((item) => item.locked);

  const pos = section.position;

  const getMaxZIndex = () =>
    sections.reduce((max, item) => Math.max(max, item.position?.zIndex ?? 1), 1);

  const getMinZIndex = () =>
    sections.reduce((min, item) => Math.min(min, item.position?.zIndex ?? 1), 1);

  const handleDuplicate = () => {
    const maxZ = getMaxZIndex();
    const cloneIds: string[] = [];
    selectedSections.forEach((item, index) => {
      const cloneId = `section-${Date.now()}-${index}`;
      cloneIds.push(cloneId);
      addSection({
        ...item,
        id: cloneId,
        position: {
          ...item.position,
          x: Math.min(layout.width - 80, item.position.x + 24),
          y: Math.min(layout.height - 80, item.position.y + 24),
          zIndex: maxZ + index + 1,
        },
      });
    });
    usePosterStore.getState().setSelectedSections(cloneIds);
  };

  const handleAlign = (align: 'left' | 'center-h' | 'right' | 'top' | 'center-v' | 'bottom') => {
    selectedSections.forEach((item) => {
    if (item.locked) return;
    const newPos = { ...item.position };
    switch (align) {
      case 'left':
        newPos.x = 0;
        break;
      case 'center-h':
        newPos.x = (layout.width - item.position.width) / 2;
        break;
      case 'right':
        newPos.x = layout.width - item.position.width;
        break;
      case 'top':
        newPos.y = theme.headerEnabled === false ? 0 : 90;
        break;
      case 'center-v':
        {
          const headerOffset = theme.headerEnabled === false ? 0 : 90;
          newPos.y = headerOffset + (layout.height - headerOffset - item.position.height) / 2;
        }
        break;
      case 'bottom':
        newPos.y = layout.height - item.position.height;
        break;
    }
    updateSection(item.id, { position: newPos });
    });
  };

  const handleDistributeEvenly = () => {
    const rowSections = isMulti
      ? selectedSections
      : sections.filter((s) => Math.abs(s.position.y - pos.y) < 50);
    if (rowSections.length > 1) {
      const allInRow = [...rowSections].sort((a, b) => a.position.x - b.position.x);
      const totalWidth = allInRow.reduce((sum, s) => sum + s.position.width, 0);
      const availableSpace = layout.width - totalWidth;
      const gap = availableSpace / (allInRow.length + 1);
      let currentX = gap;
      allInRow.forEach((s) => {
        if (s.locked) return;
        updateSection(s.id, {
          position: { ...s.position, x: currentX },
        });
        currentX += s.position.width + gap;
      });
    }
  };

  const updateSelectedStyle = (patch: Partial<SectionStyle>) => {
    selectedSections.forEach((item) => {
      if (item.locked) return;
      updateSection(item.id, { style: { ...(item.style ?? {}), ...patch } });
    });
  };

  const sharedStyle = section.style ?? {};
  const fontSize = sharedStyle.fontSize ?? 9;
  const isBold = sharedStyle.fontWeight === 'bold';
  const isItalic = sharedStyle.fontStyle === 'italic';
  const textAlign = sharedStyle.textAlign ?? 'left';
  const containerStyle = sharedStyle.containerStyle ?? 'default';
  const borderRadius = sharedStyle.borderRadius ?? 12;

  const buttonBase =
    'w-8 h-8 flex items-center justify-center rounded-lg transition-all border border-transparent';
  const buttonInactive = `${buttonBase} hover:bg-[var(--editor-input-bg-focus)]`;

  return (
    <div
      className="fixed z-[1000] glass-floating p-1.5 flex items-center gap-0.5 print:hidden"
      style={{
        top: 108,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'var(--editor-text-secondary)',
      }}
      data-editor-ui="true"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Layer controls */}
      <div className="flex items-center gap-0.5 mr-1 pr-1 border-r" style={{ borderColor: 'var(--editor-border)' }}>
        <button
          onClick={() =>
            selectedSections.forEach((item, index) =>
              !item.locked &&
              updateSection(item.id, {
                position: { ...item.position, zIndex: getMaxZIndex() + index + 1 },
              })
            )
          }
          className={buttonInactive}
          title="Bring to front"
        >
          <ArrowUp size={14} />
        </button>
        <button
          onClick={() =>
            selectedSections.forEach((item, index) =>
              !item.locked &&
              updateSection(item.id, {
                position: { ...item.position, zIndex: getMinZIndex() - index - 1 },
              })
            )
          }
          className={buttonInactive}
          title="Send to back"
        >
          <ArrowDown size={14} />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5 mr-1 pr-1 border-r" style={{ borderColor: 'var(--editor-border)' }}>
        <button onClick={() => handleAlign('left')} className={buttonInactive} title="Align left">
          <AlignLeft size={14} />
        </button>
        <button onClick={() => handleAlign('center-h')} className={buttonInactive} title="Align center horizontal">
          <AlignCenter size={14} />
        </button>
        <button onClick={() => handleAlign('right')} className={buttonInactive} title="Align right">
          <AlignRight size={14} />
        </button>
        <div className="w-px h-4 mx-0.5" style={{ background: 'var(--editor-border)' }} />
        <button onClick={() => handleAlign('top')} className={buttonInactive} title="Align top">
          <AlignVerticalJustifyStart size={14} />
        </button>
        <button onClick={() => handleAlign('center-v')} className={buttonInactive} title="Align center vertical">
          <AlignVerticalJustifyCenter size={14} />
        </button>
        <button onClick={() => handleAlign('bottom')} className={buttonInactive} title="Align bottom">
          <AlignVerticalJustifyEnd size={14} />
        </button>
      </div>

      {/* Distribute */}
      <div className="flex items-center gap-0.5 mr-1 pr-1 border-r" style={{ borderColor: 'var(--editor-border)' }}>
        <button onClick={handleDistributeEvenly} className={buttonInactive} title="Distribute evenly">
          <MoveHorizontal size={14} />
        </button>
      </div>

      {/* Text size quick adjust */}
      <div className="flex items-center gap-0.5 mr-1 pr-1 border-r" style={{ borderColor: 'var(--editor-border)' }}>
        <button
          onClick={() => {
            updateSelectedStyle({ fontSize: Math.max(7, fontSize - 1) });
          }}
          className={buttonInactive}
          title="Decrease text size"
        >
          <Type size={12} />
        </button>
        <button
          onClick={() => {
            updateSelectedStyle({ fontSize: Math.min(32, fontSize + 1) });
          }}
          className={buttonInactive}
          title="Increase text size"
        >
          <Type size={16} />
        </button>
      </div>

      {/* Batch text formatting */}
      <div className="flex items-center gap-0.5 mr-1 pr-1 border-r" style={{ borderColor: 'var(--editor-border)' }}>
        <button
          onClick={() => updateSelectedStyle({ fontWeight: isBold ? 'normal' : 'bold' })}
          className={`${buttonInactive} ${isBold ? 'bg-[var(--editor-accent-bg)] text-[var(--editor-accent)]' : ''}`}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => updateSelectedStyle({ fontStyle: isItalic ? 'normal' : 'italic' })}
          className={`${buttonInactive} ${isItalic ? 'bg-[var(--editor-accent-bg)] text-[var(--editor-accent)]' : ''}`}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          onClick={() => updateSelectedStyle({ textTransform: sharedStyle.textTransform === 'uppercase' ? 'none' : 'uppercase' })}
          className={`${buttonInactive} ${sharedStyle.textTransform === 'uppercase' ? 'bg-[var(--editor-accent-bg)] text-[var(--editor-accent)]' : ''}`}
          title="Uppercase"
        >
          <CaseUpper size={14} />
        </button>
      </div>

      {/* Batch section styling */}
      <div className="flex items-center gap-1 mr-1 pr-1 border-r" style={{ borderColor: 'var(--editor-border)' }}>
        <select
          value={textAlign}
          onChange={(e) => updateSelectedStyle({ textAlign: e.target.value as SectionStyle['textAlign'] })}
          className="h-8 rounded-lg border px-2 text-[11px] outline-none"
          style={{
            background: 'var(--editor-input-bg)',
            borderColor: 'var(--editor-border)',
            color: 'var(--editor-text)',
          }}
          title="Text alignment"
        >
          <option value="left">Text Left</option>
          <option value="center">Text Center</option>
          <option value="right">Text Right</option>
        </select>
        <select
          value={containerStyle}
          onChange={(e) => updateSelectedStyle({ containerStyle: e.target.value as SectionStyle['containerStyle'] })}
          className="h-8 rounded-lg border px-2 text-[11px] outline-none"
          style={{
            background: 'var(--editor-input-bg)',
            borderColor: 'var(--editor-border)',
            color: 'var(--editor-text)',
          }}
          title="Section container style"
        >
          <option value="default">Default</option>
          <option value="card">Card</option>
          <option value="outline">Outline</option>
          <option value="accent-top">Accent Top</option>
          <option value="accent-left">Accent Left</option>
          <option value="minimal">Minimal</option>
          <option value="ghost">Ghost</option>
          <option value="none">None</option>
        </select>
        <button
          onClick={() => updateSelectedStyle({ borderRadius: borderRadius >= 20 ? 8 : Math.min(32, borderRadius + 4) })}
          className={buttonInactive}
          title="Change corner radius"
        >
          <Square size={14} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={() =>
            selectedSections.forEach((item) =>
              updateSection(item.id, { locked: !allLocked })
            )
          }
          className={`${buttonInactive} ${allLocked ? 'bg-[var(--editor-accent-bg)] text-[var(--editor-accent)]' : ''}`}
          title={allLocked ? 'Unlock selected sections' : 'Lock selected sections'}
        >
          {allLocked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
        <button onClick={handleDuplicate} className={buttonInactive} title="Duplicate">
          <Copy size={14} />
        </button>
        <button
          onClick={() => selectedSections.forEach((item) => deleteSection(item.id))}
          className={`${buttonBase} hover:bg-red-500/15 hover:text-red-500`}
          title="Delete section"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Dimensions */}
      <div
        className="ml-2 pl-2 text-[10px] font-mono border-l"
        style={{ borderColor: 'var(--editor-border)', color: 'var(--editor-text-muted)' }}
      >
        {isMulti ? `${selectedSections.length} selected` : `${Math.round(pos.width)} x ${Math.round(pos.height)} mm`}
      </div>
    </div>
  );
};

export default FloatingSectionToolbar;
