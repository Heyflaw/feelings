// src/components/GenerativeSketchIframe.tsx
"use client";

import React, { useState, useEffect } from "react";

interface GenerativeSketchIframeProps {
  regenerateTrigger: number;
  width?: string;
  height?: string;
}

export default function GenerativeSketchIframe({
  regenerateTrigger,
  width = "100%",
  height = "100%",
}: GenerativeSketchIframeProps) {
  const [loading, setLoading] = useState(true);

  // On remet loading à true à chaque regen
  useEffect(() => {
    setLoading(true);
  }, [regenerateTrigger]);

  return (
    <div style={{ position: "relative", width, height }}>
      {loading && (
        <div className="loader-overlay">
          <div className="loader-grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="loader-dot"
                style={{
                  animationDelay: `${(i % 3) * 0.2 + Math.floor(i / 3) * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      <iframe
        key={regenerateTrigger}
        src="/sketch/index.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="fullscreen"
        onLoad={() => setLoading(false)}
      />
      <style jsx>{`
        .loader-overlay {
          position: absolute;
          inset: 0;
          background: rgb(244, 245, 239);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        .loader-grid {
          display: grid;
          grid-template-columns: repeat(3, 25px);
          grid-gap: 8px;
        }
        .loader-dot {
          width: 25px;
          height: 25px;
          background: #000;
          border-radius: 50%;
          opacity: 0.2;
          animation: fade 1s ease-in-out infinite;
        }
        @keyframes fade {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
