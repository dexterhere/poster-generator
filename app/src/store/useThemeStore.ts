import { create } from 'zustand';

export type EditorTheme = 'dark' | 'light';

interface ThemeStore {
  editorTheme: EditorTheme;
  toggleTheme: () => void;
  setTheme: (theme: EditorTheme) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  editorTheme: 'light',
  toggleTheme: () =>
    set((state) => ({
      editorTheme: state.editorTheme === 'dark' ? 'light' : 'dark',
    })),
  setTheme: (theme) => set({ editorTheme: theme }),
}));
