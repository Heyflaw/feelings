"use client";
import React, { useEffect, useRef } from "react";
import p5 from "p5"; // Import par défaut

interface GenerativeSketchProps {
  regenerateTrigger: number;
}

interface WindowWithSketch extends Window {
  createSketch?: (containerId: string) => p5; // Utiliser p5 comme type
}

export default function GenerativeSketch({
  regenerateTrigger,
}: GenerativeSketchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<p5 | null>(null); // Utiliser p5 comme type

  const initSketch = () => {
    // Supprime l’ancienne instance (canvas + listeners)
    if (instanceRef.current) {
      instanceRef.current.remove();
      instanceRef.current = null;
    }
    // Vide le container DOM
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
    // Instancie le sketch
    const windowWithSketch = window as unknown as WindowWithSketch;
    const factory = windowWithSketch.createSketch;
    if (typeof factory === "function") {
      instanceRef.current = factory("p5-container");
    } else {
      console.error(
        "createSketch() introuvable : as-tu bien chargé /sketch.js ?"
      );
    }
  };

  // Au premier rendu ET à chaque regenerateTrigger change
  useEffect(() => {
    initSketch();
  }, [regenerateTrigger]);

  // Cleanup à la destruction du composant
  useEffect(() => {
    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      id="p5-container"
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
