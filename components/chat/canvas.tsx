"use client";

import React from "react";
import { PageType } from "@/types/project";

type CanvasProps = {
  pages: PageType[];
  setPages: React.Dispatch<React.SetStateAction<PageType[]>>;
  slugId: string;
  isProjectLoading?: boolean;
};

const Canvas = ({ pages, slugId, isProjectLoading }: CanvasProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      {isProjectLoading ? (
        <p className="text-muted-foreground text-sm">Loading canvas...</p>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Canvas for {slugId}</p>
          <p className="text-xs text-muted-foreground">{pages.length} pages</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
