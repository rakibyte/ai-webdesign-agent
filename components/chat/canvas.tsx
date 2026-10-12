"use client";

import React, { useState } from "react";
import { PageType } from "@/types/project";
import { useCanvas } from "@/hooks/use-canvas";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type CanvasProps = {
  pages: PageType[];
  setPages: React.Dispatch<React.SetStateAction<PageType[]>>;
  slugId: string;
  isProjectLoading?: boolean;
};

const Canvas = ({ pages, isProjectLoading }: CanvasProps) => {
  const { selectedPageId, setSelectedPageId } = useCanvas();
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const activePage = pages.find((p) => p.id === selectedPageId) || pages[0];

  const deviceWidth =
    device === "mobile" ? "max-w-[375px]" : device === "tablet" ? "max-w-[768px]" : "w-full";

  return (
    <div className="flex flex-col h-full w-full bg-muted/30">
      {/* Canvas Header / Controls */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {pages.map((p) => {
            const isActive = activePage?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPageId(p.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {p.name || p.id}
                {Boolean(p.isLoading) && <Spinner className="inline-block ml-1.5 size-3" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 pr-36">
          <Button
            variant={device === "desktop" ? "secondary" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => setDevice("desktop")}
            title="Desktop view"
          >
            <Monitor className="size-3.5" />
          </Button>
          <Button
            variant={device === "tablet" ? "secondary" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => setDevice("tablet")}
            title="Tablet view"
          >
            <Tablet className="size-3.5" />
          </Button>
          <Button
            variant={device === "mobile" ? "secondary" : "ghost"}
            size="icon"
            className="size-7"
            onClick={() => setDevice("mobile")}
            title="Mobile view"
          >
            <Smartphone className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
        {isProjectLoading ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Spinner className="size-6" />
            <p className="text-sm">Loading project canvas...</p>
          </div>
        ) : activePage?.isLoading ? (
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Spinner className="size-6" />
            <p className="text-sm">Generating {activePage.name} page...</p>
          </div>
        ) : typeof activePage?.htmlContent === "string" && activePage.htmlContent ? (
          <div
            className={`h-full ${deviceWidth} transition-all duration-300 rounded-xl overflow-hidden shadow-lg border border-border/60 bg-background`}
          >
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><style>${activePage.rootStyles || ""}</style></head><body class="bg-background text-foreground">${activePage.htmlContent}</body></html>`}
              className="w-full h-full border-0"
              title={activePage.name || "Preview"}
              sandbox="allow-scripts"
            />
          </div>
        ) : (
          <div className="text-center space-y-2 p-8 max-w-sm">
            <p className="text-sm font-medium">No page content yet</p>
            <p className="text-xs text-muted-foreground">
              Describe your website idea in the chat to start generating pages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
