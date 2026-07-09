"use client";
import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { useWindowStore } from "@/store/useWindowStore";
import { useProjectStore } from "@/store/useProjectStore";

export default function WindowFrame({ win, isMobile }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  if (win.minimized) return null;

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed inset-0 z-[9999] flex flex-col bg-neutral-900"
      >
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-white/10">
          <span className="text-white text-sm font-medium truncate">{win.title}</span>
          <button
            onClick={() => closeWindow(win.id)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-sm"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 text-gray-200 text-sm">
          <WindowContent win={win} />
        </div>
      </motion.div>
    );
  }
  return (
    <Rnd
   
      default={{
        x: 100 + Math.random() * 100,
        y: 80 + Math.random() * 60,
        width: 480,
        height: 360,
      }}
      minWidth={320}
      minHeight={220}
      bounds="parent"
      dragHandleClassName="window-titlebar"
      style={{ zIndex: win.zIndex }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full h-full flex flex-col rounded-lg overflow-hidden shadow-2xl border border-white/10 bg-neutral-900"
      >
        {/* Title bar */}
        <div className="window-titlebar flex items-center justify-between px-3 py-2 bg-neutral-800 cursor-move select-none">
          <span className="text-white text-sm font-medium truncate">
            {win.title}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => minimizeWindow(win.id)}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400"
              aria-label="Minimize"
            />
            <button
              onClick={() => closeWindow(win.id)}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400"
              aria-label="Close"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 text-gray-200 text-sm">
          <WindowContent win={win} />
        </div>
      </motion.div>
    </Rnd>
  );
}

function WindowContent({ win }) {
  switch (win.type) {
    case "project":
      return <ProjectContent data={win.data} />;
    case "about":
      return <AboutContent />;
    case "terminal":
      return <TerminalContent />;
    case "contact":
      return <ContactContent />;
      case "login":
      return <LoginForm />;
    case "add-project":
      return <AddProjectForm />;
      case "recycle-bin":
  return <RecycleBin />;
      case "explorer":
  return <FileExplorer />;
  case "edit-project":
  return <EditProjectForm data={win.data} windowId={win.id} />;
    default:
      return <p>Empty window.</p>;
  }
}
function ProjectContent({ data }) {
  const isAdmin = useProjectStore((s) => s.isAdmin);
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div className="space-y-3">
      {data.imageUrl && (
        <img src={data.imageUrl} alt={data.title} className="w-full rounded-md" />
      )}
      <p>{data.description}</p>
      {data.techStack && data.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.techStack.map((t) => (
            <span key={t} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
              {t}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-3 pt-2 items-center">
        {data.liveUrl && (
          <a href={data.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-xs">
            Live Demo
          </a>
        )}
        {data.githubUrl && (
          <a href={data.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-xs">
            GitHub
          </a>
        )}
        {isAdmin && (
          <button
            onClick={() =>
              openWindow(`edit-${data._id}`, `Edit: ${data.title}`, "edit-project", data)
            }
            className="text-xs text-white/60 hover:text-white ml-auto"
          >
            ✏️ Edit
          </button>
        )}
      </div>
    </div>
  );
}

function AboutContent() {
  return (
    <p>
      Hi, I'm Abdulqoyum,a Computer Science student and MERN stack
      developer. This OS is my portfolio, built with Next.js.
    </p>
  );
}

function TerminalContent() {
  return (
    <div className="font-mono text-green-400 text-xs space-y-1">
      <p>guest@abdulqoyum-os:~$ whoami</p>
      <p className="text-gray-400">Abdulqoyum — CS student, developer</p>
      <p>guest@abdulqoyum-os:~$ _</p>
    </div>
  );
}
function RecycleBin() {
  const trash = useProjectStore((s) => s.trash);
  const fetchTrash = useProjectStore((s) => s.fetchTrash);
  const restoreProject = useProjectStore((s) => s.restoreProject);
  const permanentDeleteProject = useProjectStore((s) => s.permanentDeleteProject);
  const isAdmin = useProjectStore((s) => s.isAdmin);

useEffect(() => {
  fetchTrash();
}, []);

  if (!isAdmin) {
    return (
      <p className="text-white/40 text-xs">
        Only the admin can view deleted items.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-white/50 text-xs mb-3 font-mono">🗑️ Recycle Bin</p>
      {trash.length === 0 && (
        <p className="text-white/40 text-xs">Recycle bin is empty.</p>
      )}
      {trash.map((p) => (
        <div
          key={p._id}
          className="flex items-center gap-3 px-2 py-2 rounded bg-white/5"
        >
          <span className="text-xl">{p.icon || "📁"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{p.title}</p>
            <p className="text-white/40 text-xs">
              Deleted {p.deletedAt ? new Date(p.deletedAt).toLocaleDateString() : ""}
            </p>
          </div>
          <button
            onClick={() => restoreProject(p._id)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            Restore
          </button>
          <button
            onClick={() => {
              if (confirm("Permanently delete this project? This cannot be undone."))
                permanentDeleteProject(p._id);
            }}
            className="text-xs text-red-400 hover:text-red-300"
          >
            Delete Permanently
          </button>
        </div>
      ))}
    </div>
  );
}

function ContactContent() {
  return (
    <div className="space-y-2 text-xs">
      <p>Email: your@email.com</p>
      <p>LinkedIn: your-link-here</p>
      <p>GitHub: your-link-here</p>
    </div>
  );
}
function FileExplorer() {
  const projects = useProjectStore((s) => s.projects);
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div className="space-y-1">
      <p className="text-white/50 text-xs mb-3 font-mono">~/projects</p>
      {projects.length === 0 && (
        <p className="text-white/40 text-xs">No projects yet.</p>
      )}
      {projects.map((p) => (
        <button
          key={p._id}
          onDoubleClick={() =>
            openWindow(p._id, p.title, "project", p)
          }
          className="w-full flex items-center gap-3 px-2 py-2 rounded hover:bg-white/10 text-left transition-colors"
        >
          <span className="text-xl">{p.icon || "📁"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm truncate">{p.title}</p>
            <p className="text-white/40 text-xs">
              {new Date(p.createdAt).toLocaleDateString()}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setAdmin = useProjectStore((s) => s.setAdmin);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setAdmin(true);
      closeWindow("login");
      openWindow("add-project", "Add Project", "add-project");
    } else {
      setError("Wrong password.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin password"
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
        autoFocus
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}

function AddProjectForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    imageUrl: "",
    liveUrl: "",
    githubUrl: "",
    icon: "📁",
  });
  const [status, setStatus] = useState("");
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });

    if (res.ok) {
      setStatus("done");
      await fetchProjects();
      setTimeout(() => closeWindow("add-project"), 600);
    } else {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Project title"
        required
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        required
        rows={3}
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
      />
      <input
        name="techStack"
        value={form.techStack}
        onChange={handleChange}
        placeholder="Tech stack, comma separated (React, Node, MongoDB)"
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
      />
      <input
        name="imageUrl"
        value={form.imageUrl}
        onChange={handleChange}
        placeholder="Image URL (optional)"
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
      />
      <input
        name="liveUrl"
        value={form.liveUrl}
        onChange={handleChange}
        placeholder="Live demo URL (optional)"
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
      />
      <input
        name="githubUrl"
        value={form.githubUrl}
        onChange={handleChange}
        placeholder="GitHub URL (optional)"
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
      />
      <input
        name="icon"
        value={form.icon}
        onChange={handleChange}
        placeholder="Icon emoji (e.g. 🗂️)"
        className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded"
      >
        {status === "saving" ? "Saving..." : "Add Project"}
      </button>
      {status === "done" && (
        <p className="text-green-400 text-xs">Project added!</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs">Something went wrong.</p>
      )}
    </form>
  );
}
function EditProjectForm({ data, windowId }) {
  const [form, setForm] = useState({
    title: data.title || "",
    description: data.description || "",
    techStack: (data.techStack || []).join(", "),
    imageUrl: data.imageUrl || "",
    liveUrl: data.liveUrl || "",
    githubUrl: data.githubUrl || "",
    icon: data.icon || "📁",
  });
  const [status, setStatus] = useState("");
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");

    const res = await fetch(`/api/projects/${data._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        techStack: form.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      setStatus("done");
      await fetchProjects();
      setTimeout(() => closeWindow(windowId), 600);
    } else {
      setStatus("error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project permanently?")) return;
    await fetch(`/api/projects/${data._id}`, { method: "DELETE" });
    await fetchProjects();
    closeWindow(windowId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input name="title" value={form.title} onChange={handleChange} className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500" />
      <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500" />
      <input name="techStack" value={form.techStack} onChange={handleChange} className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500" />
      <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500" />
      <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500" />
      <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500" />
      <input name="icon" value={form.icon} onChange={handleChange} className="w-full bg-neutral-800 text-white text-sm px-3 py-2 rounded border border-white/10 focus:outline-none focus:border-blue-500" />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm py-2 rounded">
          {status === "saving" ? "Saving..." : "Save Changes"}
        </button>
        <button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white text-sm px-3 rounded">
          Delete
        </button>
      </div>
      {status === "done" && <p className="text-green-400 text-xs">Saved!</p>}
      {status === "error" && <p className="text-red-400 text-xs">Something went wrong.</p>}
    </form>
  );
}