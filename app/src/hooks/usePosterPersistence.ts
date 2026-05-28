import { useEffect, useRef, useCallback } from 'react';
import { usePosterStore, type PosterState } from '../store/usePosterStore';
import { useHistoryStore } from '../store/useHistoryStore';
import {
  saveSession,
  getMostRecentSession,
  saveSnapshot,
} from '../store/persistence';
import { createPosterDraft } from '../utils/draft';

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSave(posterId: string, state: PosterState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  usePosterStore.getState().setSaveStatus('saving');
  saveTimeout = setTimeout(async () => {
    try {
      const draft = createPosterDraft(state);
      await saveSession(posterId, draft);
      usePosterStore.getState().setSaveStatus('saved');
    } catch {
      usePosterStore.getState().setSaveStatus('error');
    }
  }, 800);
}

export function usePosterPersistence() {
  const initialized = useRef(false);
  const lastStateRef = useRef<PosterState | null>(null);

  // ─── Load session on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        const recent = await getMostRecentSession();
        if (recent) {
          const state = usePosterStore.getState();
          // Merge loaded data into store
          if (recent.data.header) state.updateHeader(recent.data.header);
          if (recent.data.footer) state.updateFooter(recent.data.footer);
          if (recent.data.theme) state.updateTheme(recent.data.theme);
          if (recent.data.layout) state.updateLayout(recent.data.layout);
          if (recent.data.sections) state.setSections(recent.data.sections);
          if (recent.data.id) {
            usePosterStore.setState({ id: recent.data.id });
          }
        }
      } catch (err) {
        console.warn('Failed to restore session:', err);
      } finally {
        usePosterStore.getState().setHydrated(true);
        // Push initial state to history
        const state = usePosterStore.getState();
        useHistoryStore.getState().push(state);
        lastStateRef.current = state;
      }
    };

    init();
  }, []);

  // ─── Auto-save and history on state changes ───────────────────────────────
  useEffect(() => {
    const unsubscribe = usePosterStore.subscribe((state: PosterState, prevState: PosterState) => {
      if (!state.hydrated) return;
      if (!state.autoSaveEnabled) return;

      // Skip if only saveStatus or hydrated changed (avoid loops)
      const currentForCompare = { ...state };
      const prevForCompare = { ...prevState };
      delete (currentForCompare as Record<string, unknown>).saveStatus;
      delete (prevForCompare as Record<string, unknown>).saveStatus;
      delete (currentForCompare as Record<string, unknown>).hydrated;
      delete (prevForCompare as Record<string, unknown>).hydrated;
      delete (currentForCompare as Record<string, unknown>).autoSaveEnabled;
      delete (prevForCompare as Record<string, unknown>).autoSaveEnabled;

      if (
        JSON.stringify(currentForCompare) === JSON.stringify(prevForCompare)
      ) {
        return;
      }

      // Auto-save
      debouncedSave(state.id, state);

      // History: push on significant changes (not selection-only)
      const selectionOnly =
        currentForCompare.selectedSectionId !==
          prevForCompare.selectedSectionId &&
        JSON.stringify({ ...currentForCompare, selectedSectionId: null }) ===
          JSON.stringify({ ...prevForCompare, selectedSectionId: null });

      if (!selectionOnly && lastStateRef.current) {
        useHistoryStore.getState().push(prevState);
        lastStateRef.current = state;
      }
    });

    return () => unsubscribe();
  }, []);

  // ─── Manual save ──────────────────────────────────────────────────────────
  const manualSave = useCallback(async () => {
    const state = usePosterStore.getState();
    state.setSaveStatus('saving');
    try {
      const draft = createPosterDraft(state);
      await saveSession(state.id, draft);
      await saveSnapshot(state.id, draft, 'Manual save');
      state.setSaveStatus('saved');
      return true;
    } catch {
      state.setSaveStatus('error');
      return false;
    }
  }, []);

  return { manualSave };
}
