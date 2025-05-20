
declare module "p5" {
    interface p5 {
      brush: {
        noHatch: () => void;
        noFill: () => void;
        set: (brushName: string, color: string, weight: number) => void;
        circle: (x: number, y: number, radius: number) => void;
        setHatch: (brushName: string, color: string) => void;
        hatch: (distance: number, angle: number, options?: { brush: string; rand: number }) => void;
        reDraw: () => void;
        beginShape: () => void;
        vertex: (x: number, y: number) => void;
        endShape: (mode?: "CLOSE") => void;
      };
    }
  }