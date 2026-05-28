import { create } from 'zustand';
import type { PosterState } from './usePosterStore';

export interface HistoryState {
  past: PosterState[];
  future: PosterState[];
  canUndo: boolean;
  canRedo: boolean;
}

interface HistoryActions {
  push: (state: PosterState) => void;
  undo: () => PosterState | null;
  redo: () => PosterState | null;
  clear: () => void;
}

const MAX_HISTORY = 50;

export const useHistoryStore = create<HistoryState & HistoryActions>((set, get) => ({
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,

  push: (state) => {
    set((current) => {
      const newPast = [...current.past, state].slice(-MAX_HISTORY);
      return {
        past: newPast,
        future: [],
        canUndo: newPast.length > 0,
        canRedo: false,
      };
    });
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    set({
      past: newPast,
      future: [previous, ...future],
      canUndo: newPast.length > 0,
      canRedo: true,
    });
    return previous;
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return null;
    const next = future[0];
    const newFuture = future.slice(1);
    set({
      past: [...past, next],
      future: newFuture,
      canUndo: true,
      canRedo: newFuture.length > 0,
    });
    return next;
  },

  clear: () => {
    set({ past: [], future: [], canUndo: false, canRedo: false });
  },
}));
