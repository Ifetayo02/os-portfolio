"use client";

import { useWindowStore } from "@/store/useWindowStore";
import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";

export default function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);

  const isAdmin = useProjectStore((s) => s.isAdmin);
  const setAdmin = useProjectStore((s) => s.setAdmin);

  const [now, setNow] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setAdmin(false);
  };

  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-black/30 backdrop-blur-2xl border-t border-white/10 flex items-center px-4 z-[9998]">
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors mr-2">
          <span className="text-lg">⊞</span>
        </button>

        {/* Search */}
        <div className="relative mr-3">
          {searchOpen ? (
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => setSearchOpen(false)}
              placeholder="Search projects..."
              className="h-9 w-56 px-3 rounded-lg bg-white/10 text-white text-xs placeholder-white/50 focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              🔍
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center">
          {windows.map((w) => (
            <button
              key={w.id}
              onClick={() => (w.minimized ? focusWindow(w.id) : minimizeWindow(w.id))}
              className={`h-9 px-3 flex items-center justify-center rounded-lg text-white text-xs transition-colors ${
                w.minimized ? "bg-white/5 hover:bg-white/15" : "bg-white/20 hover:bg-white/25"
              }`}
              title={w.title}
            >
              {w.title}
            </button>
          ))}
        </div>

        {/* Admin Logout Button */}
        {isAdmin && (
          <button
            onClick={handleLogout}
            className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-2.5 py-1.5 rounded-lg mr-2 hover:bg-red-500/30 transition-colors"
          >
            Logout
          </button>
        )}

        {/* Quick Settings trigger */}
        <button
          onClick={() => setShowQuickSettings((v) => !v)}
          className="h-9 px-2 flex items-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors mr-2 text-white text-xs"
        >
          <span>{wifi ? "📶" : "📵"}</span>
          <span>{bluetooth ? "🔵" : "⚪"}</span>
          <span>🔊</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setShowNotifications((v) => !v)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors mr-2 relative"
        >
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* Clock */}
        <div className="text-white text-xs text-right leading-tight px-2 hover:bg-white/10 rounded-lg py-1 cursor-default">
          <div>{time}</div>
          <div className="text-white/60">{date}</div>
        </div>
      </div>

      {/* Notification panel */}
      {showNotifications && (
        <div className="fixed bottom-16 right-4 w-72 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-3 z-[9998]">
          <p className="text-white text-sm font-medium mb-2">Notifications</p>
          <div className="text-xs text-white/70 space-y-2">
            <div className="bg-white/5 rounded p-2">
              Welcome to AbdulqoyumOS — double-click any icon to get started.
            </div>
            <div className="bg-white/5 rounded p-2">
              System is running smoothly. No new updates.
            </div>
          </div>
        </div>
      )}

      {/* Quick Settings panel */}
      {showQuickSettings && (
        <div className="fixed bottom-16 right-4 w-64 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl p-3 z-[9998]">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => setWifi((v) => !v)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs transition-colors ${
                wifi ? "bg-blue-500/30 text-blue-300" : "bg-white/5 text-white/50"
              }`}
            >
              <span className="text-lg">📶</span>
              WiFi
            </button>
            <button
              onClick={() => setBluetooth((v) => !v)}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs transition-colors ${
                bluetooth ? "bg-blue-500/30 text-blue-300" : "bg-white/5 text-white/50"
              }`}
            >
              <span className="text-lg">🔵</span>
              Bluetooth
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-white/50 text-xs">Volume</p>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      )}
    </>
  );
}