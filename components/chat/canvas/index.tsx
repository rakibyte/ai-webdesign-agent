"use client";

import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { TOOL_MODE_ENUM, ToolModeType } from '@/constants/canvas';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';
import CanvasControls from './canvas-controls';
import PageFrame from './page-frame';
import { useCanvas } from '@/hooks/use-canvas';
import { PageType } from '@/types/project';
import { deletePageAction } from '@/app/action/action';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

type PropsType = {
  pages: PageType[];
  setPages: React.Dispatch<React.SetStateAction<PageType[]>>;
  isProjectLoading?: boolean;
  slugId: string;
};

const Canvas = ({
  pages,
  setPages,
  isProjectLoading,
  slugId,
}: PropsType) => {
  const queryClient = useQueryClient();
  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercent, setZoomPercent] = useState<number>(26);
  const [currentScale, setCurrentScale] = useState<number>(0.26);
  const [deletingPageId, setDeletingPageId] = useState<string | null>(null);
  const { selectedPageId, setSelectedPageId } = useCanvas();

  const handleDelete = async (pageId: string) => {
    setDeletingPageId(pageId);
    try {
      const result = await deletePageAction(slugId, pageId);
      if (result && "error" in result && result.error) {
        toast.error(result.error);
        setDeletingPageId(null);
        return;
      }
      setPages((prev) => prev.filter((page) => page.id !== pageId));
      queryClient.invalidateQueries({
        queryKey: ["project", slugId],
      });
      toast.success("Page deleted successfully");
    } catch {
      toast.error("Failed to delete page");
    } finally {
      setDeletingPageId(null);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-background">
      <TransformWrapper
        initialScale={0.26}
        initialPositionX={40}
        initialPositionY={5}
        minScale={0.1}
        maxScale={3}
        wheel={{ step: 0.1 }}
        pinch={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        centerZoomedOut={false}
        centerOnInit={false}
        smooth={true}
        limitToBounds={false}
        panning={{
          disabled: toolMode !== TOOL_MODE_ENUM.HAND,
        }}
        onTransform={(ref) => {
          setZoomPercent(Math.round(ref.state.scale * 100));
          setCurrentScale(ref.state.scale);
        }}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <div
              className={cn(
                "absolute inset-0 w-full h-full bg-[#f8f9fa] dark:bg-[#0c0d0e] p-3",
                toolMode === TOOL_MODE_ENUM.HAND
                  ? "cursor-grab active:cursor-grabbing"
                  : "cursor-default"
              )}
              style={{
                backgroundImage:
                  "radial-gradient(circle, color-mix(in oklch, var(--primary) 25%, transparent) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
              onClick={() => setSelectedPageId(null)}
            >
              {isProjectLoading && (
                <div className="absolute inset-0 z-50 flex flex-col gap-2 items-center justify-center bg-background/50 backdrop-blur-xs">
                  <Spinner className="w-10 h-10" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Preparing workspace...
                  </span>
                </div>
              )}

              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "100%",
                  overflow: "unset",
                }}
                contentStyle={{
                  width: "100%",
                  height: "100%",
                }}
              >
                {pages.map((page, i) => {
                  const x = 100 + i * 1600;
                  const y = 100;
                  const isDeleting = deletingPageId === page.id;
                  return (
                    <PageFrame
                      key={page.id}
                      page={page}
                      scale={currentScale}
                      toolMode={toolMode}
                      initialPosition={{
                        x,
                        y,
                      }}
                      selectedPageId={selectedPageId}
                      setSelectedPageId={setSelectedPageId}
                      isDeleting={isDeleting}
                      onDeletePage={handleDelete}
                    />
                  );
                })}
              </TransformComponent>
            </div>

            <CanvasControls
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              zoomPercent={zoomPercent}
              toolMode={toolMode}
              setToolMode={setToolMode}
            />
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Canvas;
