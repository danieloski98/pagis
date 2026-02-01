export type LayerType = "text" | "image" | "shape";

export interface Layer {
  id: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  content?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  imageUri?: string;
  shapeType?: "rect" | "circle" | "triangle";
  backgroundColor?: string;
}

export interface CanvasSize {
  width: number;
  height: number;
  name: string;
}

export const CANVAS_PRESETS: Record<string, CanvasSize> = {
  instagram: { width: 1080, height: 1080, name: "Instagram Post" },
  story: { width: 1080, height: 1920, name: "Instagram Story" },
  a4: { width: 794, height: 1123, name: "A4 Paper" },
  usLetter: { width: 816, height: 1056, name: "US Letter" },
  custom: { width: 800, height: 600, name: "Custom" },
};
