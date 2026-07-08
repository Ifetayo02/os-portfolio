"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { useEffect, useState } from "react";

export default function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-black/30 backdrop-blur-2xl border-t border-white/10 flex items-center px-4 z-[9998]">
      <div className="flex items-center gap-2 flex-1 justify-center">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
          <span className="text-lg">⊞</span>
        </button>

        {windows.map((w) => (
          <button
            key={w.id}
            onClick={() =>
              w.minimized ? focusWindow(w.id) : minimizeWindow(w.id)
            }
            className={`h-9 px-3 flex items-center justify-center rounded-lg text-white text-xs transition-colors ${
              w.minimized
                ? "bg-white/5 hover:bg-white/15"
                : "bg-white/20 hover:bg-white/25"
            }`}
            title={w.title}
          >
            {w.title}
          </button>
        ))}
      </div>

      <span className="text-white text-xs font-medium absolute right-4">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </div>
  );
}