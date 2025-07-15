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

  useEffect(() => {
    console.log(
      "GenerativeSketchIframe mounted with regenerateTrigger:",
      regenerateTrigger
    );
    return () => {
      console.log("GenerativeSketchIframe unmounted");
    };
  }, [regenerateTrigger]);

  return (
    <div style={{ position: "relative", width, height }}>
      {loading && (
        <div className="loader-overlay">
          <svg width="60" height="20" viewBox="0 0 120 30">
            <circle cx="30" cy="15" r="10" fill="#616161">
              <animate
                attributeName="cy"
                from="15"
                to="15"
                dur="0.6s"
                begin="0s"
                repeatCount="indefinite"
                values="15;5;15"
                keyTimes="0;0.5;1"
              ></animate>
            </circle>
            <circle cx="60" cy="15" r="10" fill="#616161">
              <animate
                attributeName="cy"
                from="15"
                to="15"
                dur="0.6s"
                begin="0.2s"
                repeatCount="indefinite"
                values="15;5;15"
                keyTimes="0;0.5;1"
              ></animate>
            </circle>
            <circle cx="90" cy="15" r="10" fill="#616161">
              <animate
                attributeName="cy"
                from="15"
                to="15"
                dur="0.6s"
                begin="0.4s"
                repeatCount="indefinite"
                values="15;5;15"
                keyTimes="0;0.5;1"
              ></animate>
            </circle>
          </svg>
        </div>
      )}
      <iframe
        key={regenerateTrigger}
        src={`/sketch/index.html?t=${regenerateTrigger}`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="fullscreen"
        onLoad={() => {
          console.log(
            "Iframe loaded with regenerateTrigger:",
            regenerateTrigger
          );
          setLoading(false);
        }}
      />
      <style jsx>{`
        .loader-overlay {
          position: absolute;
          inset: 0;
          background: var(--color-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
