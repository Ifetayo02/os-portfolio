"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { useProjectStore } from "@/store/useProjectStore";

export default function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const projects = useProjectStore((s) => s.projects);
  const isAdmin = useProjectStore((s) => s.isAdmin);

const staticApps = [
  { id: "about", title: "About Me", icon: "👤", type: "about" },
  { id: "explorer", title: "File Explorer", icon: "🗂️", type: "explorer" },
  { id: "terminal", title: "Terminal", icon: "💻", type: "terminal" },
  { id: "contact", title: "Contact", icon: "✉️", type: "contact" },
    { id: "recycle-bin", title: "Recycle Bin", icon: "🗑️", type: "recycle-bin" },
];

  const handleAdminClick = () => {
    if (isAdmin) {
      openWindow("add-project", "Add Project", "add-project");
    } else {
      openWindow("login", "Admin Login", "login");
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,90px)] gap-4 p-6 content-start">
      {staticApps.map((app) => (
        <DesktopIcon
          key={app.id}
          icon={app.icon}
          label={app.title}
          onDoubleClick={() => openWindow(app.id, app.title, app.type)}
        />
      ))}

      <DesktopIcon
        icon={isAdmin ? "🔓" : "🔒"}
        label={isAdmin ? "Add Project" : "Admin Login"}
        onDoubleClick={handleAdminClick}
      />

      {projects.map((project) => (
        <DesktopIcon
          key={project._id}
          icon={project.icon || "📁"}
          label={project.title}
          onDoubleClick={() =>
            openWindow(project._id, project.title, "project", project)
          }
        />
      ))}
    </div>
  );
}

function DesktopIcon({ icon, label, onDoubleClick }) {
  return (
    <button
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center gap-1.5 p-2 rounded-md hover:bg-white/15 focus:bg-blue-500/30 focus:outline-none transition-colors"
    >
      <span className="text-4xl drop-shadow-lg">{icon}</span>
      <span className="text-white text-xs text-center leading-tight px-1 py-0.5 rounded bg-black/20 backdrop-blur-sm">
        {label}
      </span>
    </button>
  );
}