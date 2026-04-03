# Plan v2: Canva-Like Experience Redesign

**Document version:** 2.0
**Prepared by:** Prince Bhagat
**Date:** April 2026
**Purpose:** Full redesign of the poster builder UX to a canvas-first, Canva-like experience

---

## Context

The current poster builder uses a fixed 360px left sidebar as the primary control surface. This leaves the canvas cramped and the editing experience feels form-like rather than spatial. Three major problems:

1. **UX:** The sidebar is always present, shrinking canvas space. Users can't focus on the poster — there's no "canvas-first" mode.
2. **Section Styles:** A single global `borderStyle` theme applies to all sections equally. Users have no way to style sections individually or free up space by hiding the title bar.
3. **Alignment & Font Bugs:** `StatsSection` ignores `textAlign`. `FlowSection` overrides user alignment based on direction. Font size defaults are inconsistent across section types (11px vs 20px). Hex opacity is concatenated as a raw string (breaks with non-hex colors). LineHeight default is 1.5 in `TextSection` but 1.4 in the editor.

**Intended outcome:** A smooth, Canva-like canvas experience where the poster is the primary focus, panels float over it on demand, sections are individually styleable, and all alignment/font controls work correctly.

---

## Critical Files

| File | Role |
|------|------|
| `app/src/pages/BuilderPage.tsx` | Main shell — full restructure |
| `app/src/store/usePosterStore.ts` | Extend `SectionStyle` with 2 new fields |
| `app/src/components/poster/PosterCanvas.tsx` | Per-section container styles, selection ring, center-vertical fix |
| `app/src/components/sections/StatsSection.tsx` | Fix textAlign |
| `app/src/components/sections/FlowSection.tsx` | Fix alignment override, lineHeight default |
| `app/src/components/sections/TextSection.tsx` | Fix lineHeight default |
| `app/src/components/sections/QuestionSection.tsx` | Fix default fontSize (20→18px), lineHeight |
| `app/src/components/editor/SectionEditor.tsx` | Add container style + hideTitle controls |
| `app/src/index.css` | Dot-grid canvas background, poster shadow |

**New files created:**
- `app/src/utils/colorUtils.ts`
- `app/src/components/layout/TopBar.tsx`
- `app/src/components/layout/LeftToolbar.tsx`
- `app/src/components/layout/LeftPanel.tsx`
- `app/src/components/layout/RightInspector.tsx`

---

## Implementation Steps

### Step 1 — Extend Zustand Store
**File:** `app/src/store/usePosterStore.ts`

Add to `SectionStyle` interface:
```ts
containerStyle?: 'default' | 'none' | 'card' | 'outline' | 'accent-top' | 'filled' | 'minimal';
hideTitle?: boolean;
```
No action changes needed — `updateSection` already deep-merges style patches.

---

### Step 2 — Create Color Utility
**File (new):** `app/src/utils/colorUtils.ts`

```ts
export function hexOpacity(color: string, alpha: number): string {
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  return color + Math.round(alpha).toString(16).padStart(2, '0');
}
```

Replace all raw `primaryColor + '08'` concatenations across the codebase with `hexOpacity(primaryColor, 8)`.

Files using this pattern: `TextSection`, `TableSection`, `StatsSection`, `QuestionSection`, `FlowSection`, `PosterCanvas`, `PosterHeader`.

---

### Step 3 — Fix Section Renderer Bugs (all in parallel)

**3a. `StatsSection.tsx`**
- Map `s.textAlign` → `justifyContent`: `left → 'flex-start'`, `center → 'center'`, `right → 'flex-end'` (default `'center'`)
- Apply to the outer flex row container
- Replace hex concatenation with `hexOpacity`
- Default `lineHeight` to `1.4`

**3b. `FlowSection.tsx`**
- Direction-based alignment default is already using `??` correctly — confirm `FlowEditor` doesn't reset `textAlign` on direction toggle
- Normalize `lineHeight` default from `1.3` to `1.4`
- Replace hex concatenations with `hexOpacity`

**3c. `QuestionSection.tsx`**
- Change default `fontSize` from `'20px'` to `'18px'`
- Change `subtextStyle.lineHeight` default from `1.5` to `1.4`
- Replace hex concatenation with `hexOpacity`

**3d. `TextSection.tsx`**
- Change `lineHeight` default from `1.5` to `1.4`
- Replace hex concatenation with `hexOpacity`

**3e. Vertical center bug in `PosterCanvas.tsx`**
- Current: `y = (layout.height - height) / 2` — ignores header
- Fix: `y = HEADER_HEIGHT + (layout.height - HEADER_HEIGHT - height) / 2`
- Use `HEADER_HEIGHT = 90` (estimated poster header px height)

---

### Step 4 — `TopBar` Component
**File (new):** `app/src/components/layout/TopBar.tsx`

Height: 48px. Layout (left → right):
- Left: `ChevronLeft` home link, "Poster Generator" brand, layout name pill
- Center: `ZoomOut` button, zoom % display, `ZoomIn` button, "Fit" shortcut, "100%" shortcut
- Right: Fullscreen toggle, Export button

---

### Step 5 — `LeftToolbar` Component
**File (new):** `app/src/components/layout/LeftToolbar.tsx`

Width: 56px, full height below TopBar. Icon-only vertical strip:
- `Type` → Header panel
- `Layout` → Sections panel
- `Palette` → Theme panel
- `Download` → Export panel

Clicking active icon closes the panel (`activePanel → null`).

---

### Step 6 — `LeftPanel` Component (Overlay Drawer)
**File (new):** `app/src/components/layout/LeftPanel.tsx`

Width: 300px. Slides in/out with `transition-transform duration-200` CSS transition.
Renders one of `HeaderPanel`, `SectionsListPanel`, `ThemePanel`, `ExportPanel` based on `activePanel`.

---

### Step 7 — `RightInspector` Component
**File (new):** `app/src/components/layout/RightInspector.tsx`

Width: 280px. Slides in from right when `selectedSectionId` is non-null.
Contains `SectionEditor` content.

---

### Step 8 — Per-Section Container Style Controls
**File:** `app/src/components/editor/SectionEditor.tsx`

Add a "Container" block with:
- 7-option button grid: default, none, card, outline, accent-top, filled, minimal
- `hideTitle` checkbox

---

### Step 9 — Update `PosterCanvas.tsx`
- Per-section `resolveContainerStyle()` function (7 styles)
- `hideTitle` support (zero-height invisible drag handle)
- Cleaner selection ring (overlay sibling div with `pointer-events-none`)
- Vertical center fix: subtract `HEADER_HEIGHT = 90` from calculation

---

### Step 10 — Keyboard Shortcuts
- `Escape` → deselect section
- `Delete`/`Backspace` → delete selected section (not when typing in inputs)

---

### Step 11 — Rebuild `BuilderPage.tsx` Shell
New structure:
```
TopBar (48px)
├─ LeftToolbar (56px)
├─ LeftPanel (300px overlay)
├─ Canvas workspace (flex-1, overflow-auto, dot-grid bg)
└─ RightInspector (280px overlay)
```

Updated `getDynamicScale`:
```ts
const rightW = selectedSectionId ? 280 : 0;
const availableWidth = window.innerWidth - 56 - rightW - padding - rulerSpace;
const availableHeight = window.innerHeight - 48 - padding - rulerSpace;
```

---

### Step 12 — CSS Enhancements
**File:** `app/src/index.css`

```css
.canvas-workspace {
  background-color: #d1d5db;
  background-image: radial-gradient(circle, #9ca3af 1px, transparent 1px);
  background-size: 24px 24px;
}

#poster-canvas {
  box-shadow: 0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12);
}
```

---

## Implementation Order

```
Step 1  (store)
  └─► Step 2  (colorUtils)
        ├─► Step 3a–3e  (renderer bug fixes)   — all parallel
        └─► Step 8      (container style UI)
Step 4  (TopBar)          ─┐
Step 5  (LeftToolbar)      ─┤
Step 6  (LeftPanel)        ─┤─► Step 11 (BuilderPage shell, last)
Step 7  (RightInspector)   ─┤
Step 9  (PosterCanvas)     ─┘
Step 10 (keyboard)   — independent
Step 12 (CSS)        — independent
```

---

## Verification Checklist

- [ ] Canvas fills full viewport; poster is the visual focus
- [ ] Left toolbar icons toggle panels; clicking active icon closes it
- [ ] Left panel slides in/out with 200ms transition; canvas stays interactive behind it
- [ ] Selecting a section opens right inspector from the right side
- [ ] Escape deselects section and closes inspector
- [ ] Delete/Backspace removes selected section (not while typing in inputs)
- [ ] Each section can override container style independently (7 options)
- [ ] `hideTitle` hides the header band and fills section with content area
- [ ] Stats section respects textAlign control (left/center/right)
- [ ] Flow section respects user-set alignment; direction default only applies when not set
- [ ] Question section renders at 18px by default (not 20px)
- [ ] All sections default to lineHeight 1.4
- [ ] Center-vertical places section in canvas body area (below poster header)
- [ ] Dot-grid canvas background visible; poster has drop shadow
- [ ] PDF export still works; no UI chrome visible in print
- [ ] `containerStyle` and `hideTitle` persist in draft save/load (JSON auto-serializes)
