"use client";

import { useEffect, useState } from "react";

export default function BootScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <div className="text-white text-3xl font-light tracking-widest mb-8">
        ABDULQOYUM<span className="text-blue-400">OS</span>
      </div>
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-400 transition-all duration-150 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="text-gray-500 text-xs mt-4 font-mono">
        Loading system...
      </div>
    </div>
  );
}