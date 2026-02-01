import { useCallback, useRef, useState } from "react";
import { CanvasSize, Layer } from "../types";

export const useCanvas = (initialSize: CanvasSize) => {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(initialSize);
  const historyRef = useRef<Layer[][]>([]);
  const historyIndexRef = useRef(-1);

  const saveHistory = useCallback(() => {
    historyRef.current = historyRef.current.slice(
      0,
      historyIndexRef.current + 1,
    );
    historyRef.current.push(JSON.parse(JSON.stringify(layers)));
    historyIndexRef.current++;
  }, [layers]);

  const addLayer = useCallback(
    (layer: Omit<Layer, "id" | "zIndex">) => {
      saveHistory();
      const newLayer: Layer = {
        ...layer,
        id: Math.random().toString(36).substr(2, 9),
        zIndex: layers.length,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedId(newLayer.id);
    },
    [layers, saveHistory],
  );

  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...updates } : layer)),
    );
  }, []);

  const deleteLayer = useCallback(
    (id: string) => {
      saveHistory();
      setLayers((prev) => prev.filter((l) => l.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId, saveHistory],
  );

  const moveLayer = useCallback(
    (id: string, direction: "up" | "down" | "top" | "bottom") => {
      saveHistory();
      setLayers((prev) => {
        const index = prev.findIndex((l) => l.id === id);
        if (index === -1) return prev;

        const newLayers = [...prev];
        const [layer] = newLayers.splice(index, 1);

        switch (direction) {
          case "up":
            newLayers.splice(Math.min(index + 1, newLayers.length), 0, layer);
            break;
          case "down":
            newLayers.splice(Math.max(index - 1, 0), 0, layer);
            break;
          case "top":
            newLayers.push(layer);
            break;
          case "bottom":
            newLayers.unshift(layer);
            break;
        }

        return newLayers.map((l, i) => ({ ...l, zIndex: i }));
      });
    },
    [saveHistory],
  );

  const undo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setLayers(
        JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current])),
      );
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      setLayers(
        JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current])),
      );
    }
  }, []);

  const duplicateLayer = useCallback(
    (id: string) => {
      const layer = layers.find((l) => l.id === id);
      if (!layer) return;

      saveHistory();
      const newLayer = {
        ...layer,
        id: Math.random().toString(36).substr(2, 9),
        x: layer.x + 20,
        y: layer.y + 20,
        zIndex: layers.length,
      };
      setLayers((prev) => [...prev, newLayer]);
      setSelectedId(newLayer.id);
    },
    [layers, saveHistory],
  );

  const canUndo = historyIndexRef.current > 0;
  const canRedo = historyIndexRef.current < historyRef.current.length - 1;

  return {
    layers,
    selectedId,
    canvasSize,
    setCanvasSize,
    setSelectedId,
    addLayer,
    updateLayer,
    deleteLayer,
    moveLayer,
    duplicateLayer,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};
