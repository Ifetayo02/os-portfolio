"use client";

import { useEffect, useState } from "react";
import BootScreen from "@/components/BootScreen";
import Desktop from "@/components/Desktop";
import Taskbar from "@/components/Taskbar";
import WindowFrame from "@/components/WindowFrame";
import { useWindowStore } from "@/store/useWindowStore";
import { useProjectStore } from "@/store/useProjectStore";

export default function Home() {
  const [booted, setBooted] = useState(false);
  const windows = useWindowStore((s) => s.windows);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const checkAuth = useProjectStore((s) => s.checkAuth);

  useEffect(() => {
    fetchProjects();
    checkAuth();
  }, [fetchProjects, checkAuth]);

  if (!booted) {
    return <BootScreen onComplete={() => setBooted(true)} />;
  }

  return (
    <main
      className="min-h-screen relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/wallpaper.jpg')" }}
    >
      <Desktop />

      {windows.map((win) => (
        <WindowFrame key={win.id} win={win} />
      ))}

      <Taskbar />
    </main>
  );
}