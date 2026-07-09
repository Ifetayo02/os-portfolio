import { create } from "zustand";

export const useProjectStore = create((set, get) => ({
  projects: [],
  trash: [],
  isAdmin: false,

  fetchProjects: async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    set({ projects: data });
  },

  fetchTrash: async () => {
    const res = await fetch("/api/projects?trash=true");
    const data = await res.json();
    set({ trash: data });
  },

  restoreProject: async (id) => {
    await fetch(`/api/projects/${id}/restore`, { method: "PUT" });
    await get().fetchProjects();
    await get().fetchTrash();
  },

  permanentDeleteProject: async (id) => {
    await fetch(`/api/projects/${id}/permanent`, { method: "DELETE" });
    await get().fetchTrash();
  },

  checkAuth: async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    set({ isAdmin: data.isAdmin });
  },

  setAdmin: (value) => set({ isAdmin: value }),
}));