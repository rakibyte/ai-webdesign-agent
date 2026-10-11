"use client";

import { useState, useEffect, useCallback } from "react";

let globalSelectedPageId: string | null = null;
const listeners = new Set<(id: string | null) => void>();

export interface CanvasState {
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
}

export function useCanvas(): CanvasState {
  const [selectedPageId, setLocalSelectedPageId] = useState<string | null>(globalSelectedPageId);

  useEffect(() => {
    const listener = (id: string | null) => {
      setLocalSelectedPageId(id);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setSelectedPageId = useCallback((id: string | null) => {
    globalSelectedPageId = id;
    listeners.forEach((listener) => listener(id));
  }, []);

  return {
    selectedPageId,
    setSelectedPageId,
  };
}

export default useCanvas;
