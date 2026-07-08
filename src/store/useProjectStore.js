import { create } from "zustand";

export const useProjectStore = create((set, get) => ({
  projects: [],
  isAdmin: false,

  fetchProjects: async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    set({ projects: data });
  },

  checkAuth: async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    set({ isAdmin: data.isAdmin });
  },

  setAdmin: (value) => set({ isAdmin: value }),
}));