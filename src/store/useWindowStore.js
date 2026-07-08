import { create } from "zustand";

export const useWindowStore = create((set, get) => ({
  windows: [], // { id, title, type, data, minimized, zIndex }
  nextZIndex: 1,

  openWindow: (id, title, type, data = {}) => {
    const existing = get().windows.find((w) => w.id === id);
    if (existing) {
      // already open — just bring to front and unminimize
      get().focusWindow(id);
      return;
    }
    set((state) => ({
      windows: [
        ...state.windows,
        {
          id,
          title,
          type,
          data,
          minimized: false,
          zIndex: state.nextZIndex,
        },
      ],
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      ),
    }));
  },

  focusWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, minimized: false, zIndex: state.nextZIndex }
          : w
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
  },
}));