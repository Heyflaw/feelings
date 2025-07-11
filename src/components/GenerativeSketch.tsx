"use client";
import React, { useEffect, useRef } from "react";
import { P5Instance } from "p5";

interface GenerativeSketchProps {
  regenerateTrigger: number;
}

// Définir une interface pour la fonction createSketch
interface WindowWithSketch extends Window {
  createSketch: (containerId: string) => P5Instance;
}

export default function GenerativeSketch({
  regenerateTrigger,
}: GenerativeSketchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<P5Instance | null>(null); // Remplacer any par P5Instance | null

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
    const factory = (window as WindowWithSketch).createSketch; // Utiliser l'interface définie
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
