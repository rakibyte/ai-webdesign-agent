"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Rnd } from "react-rnd";
import { TOOL_MODE_ENUM, ToolModeType } from '@/constants/canvas';
import { getHTMLWrapper } from '@/lib/page-wrapper';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Code2, PaintbrushIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { PageType } from '@/types/project';
import { Skeleton } from '@/components/ui/skeleton';

type PropsType = {
  page: PageType;
  initialPosition?: { x: number; y: number };
  scale?: number;
  toolMode: ToolModeType;
  selectedPageId: string | null;
  setSelectedPageId: (pageId: string | null) => void;
  isDeleting: boolean;
  onDeletePage: (pageId: string) => void;
};

const PageFrame = ({
  page,
  initialPosition = { x: 0, y: 0 },
  scale = 1,
  toolMode,
  selectedPageId,
  setSelectedPageId,
  isDeleting,
  onDeletePage,
}: PropsType) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [size, setSize] = useState({ width: 1550, height: 900 });
  const [isHovered, setIsHovered] = useState(false);
  const [showColorScheme, setShowColorScheme] = useState(false);

  const fullHtml = getHTMLWrapper(
    page.htmlContent || "",
    page.name || "Untitled",
    page.rootStyles || "",
    page.id
  );
  const isSelected = selectedPageId === page.id;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "FRAME_HEIGHT" &&
        event.data?.pageId === page.id &&
        typeof event.data?.height === "number"
      ) {
        setSize((prev) => ({
          ...prev,
          height: event.data.height,
        }));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [page.id]);

  const colorTokens = useMemo(() => {
    if (!page.rootStyles) return [];
    const tokens = [
      { key: '--background', label: 'Background' },
      { key: '--foreground', label: 'Foreground' },
      { key: '--primary', label: 'Primary' },
      { key: '--secondary', label: 'Secondary' },
      { key: '--accent', label: 'Accent' },
      { key: '--card', label: 'Card' },
      { key: '--muted', label: 'Muted' },
      { key: '--border', label: 'Border' },
    ];
    return tokens
      .map(({ key, label }) => {
        const match = (page.rootStyles || "").match(new RegExp(`${key}:\\s*([^;]+)`));
        return { label, value: match ? match[1].trim() : null };
      })
      .filter((t): t is { label: string; value: string } => Boolean(t.value));
  }, [page.rootStyles]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fullHtml);
    toast.success("Design code copied to clipboard!");
  };

  return (
    <Rnd
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: size.width,
        height: size.height,
      }}
      size={{ width: size.width, height: size.height }}
      minWidth={320}
      minHeight={900}
      scale={scale}
      disableDragging={toolMode === TOOL_MODE_ENUM.HAND}
      enableResizing={(isSelected || isHovered) && toolMode !== TOOL_MODE_ENUM.HAND}
      onResize={(_e, _direction, ref) => {
        setSize({
          width: parseInt(ref.style.width, 10),
          height: parseInt(ref.style.height, 10),
        });
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        if (page.isLoading) return;
        if (toolMode === TOOL_MODE_ENUM.SELECT) {
          setSelectedPageId(page.id);
        }
      }}
      resizeHandleComponent={{
        topLeft: isSelected || isHovered ? <Handle /> : undefined,
        topRight: isSelected || isHovered ? <Handle /> : undefined,
        bottomLeft: isSelected || isHovered ? <Handle /> : undefined,
        bottomRight: isSelected || isHovered ? <Handle /> : undefined,
      }}
      className={cn(
        "relative z-30 transition-shadow",
        (isSelected || isHovered) &&
          toolMode !== TOOL_MODE_ENUM.HAND &&
          "ring-4 ring-blue-500 ring-offset-1 shadow-2xl",
        toolMode === TOOL_MODE_ENUM.HAND
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-move"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(isSelected || isHovered) && toolMode !== TOOL_MODE_ENUM.HAND && (
        <div
          className="absolute -top-13 left-0 z-50 flex items-center bg-card rounded-lg px-1 py-1 shadow-md border"
          style={{
            transform: `scale(${1 / scale})`,
            transformOrigin: "bottom left",
          }}
        >
          <h5 className="text-xs pl-3 pr-6 font-medium truncate max-w-[150px]">
            {page.name}
          </h5>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center px-2 gap-1">
            {/* Color Scheme Popover */}
            <Popover open={showColorScheme} onOpenChange={setShowColorScheme}>
              <PopoverTrigger
                className="p-1 hover:bg-accent size-6 cursor-pointer inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
                title="Color Scheme"
              >
                <PaintbrushIcon className="size-3.5" />
              </PopoverTrigger>
              <PopoverContent align="start" className="w-52 p-3">
                <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase">
                  Color Scheme
                </p>
                <div className="flex flex-col gap-2">
                  {colorTokens.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-xs text-muted-foreground">
                        {label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="size-4 rounded-sm border border-border"
                          style={{ backgroundColor: value }}
                        />
                        <span className="text-xs font-mono text-foreground">
                          {value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              size="icon"
              variant="ghost"
              className="p-1 hover:bg-accent size-6 cursor-pointer"
              onClick={handleCopyCode}
              title="Copy Design Code"
            >
              <Code2 className="size-3.5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="p-1 hover:bg-accent size-6 cursor-pointer text-destructive hover:text-destructive"
              onClick={() => onDeletePage(page.id)}
              title="Delete Page"
            >
              {isDeleting ? <Spinner className="size-3.5" /> : <Trash2Icon className="size-3.5" />}
            </Button>
          </div>
        </div>
      )}

      <div className="w-full relative overflow-hidden rounded-sm bg-muted/90 shadow-lg">
        {page.isLoading ? (
          <div
            className="w-full h-full flex flex-col py-10 px-10 gap-3 bg-card/80 animate-pulse rounded-sm mx-px"
            style={{ width: size.width, height: size.height }}
          >
            <Skeleton className="w-full h-8" />
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-3/4 h-32 mt-4" />
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            srcDoc={fullHtml}
            title={page.name}
            sandbox="allow-scripts"
            style={{
              width: "100%",
              height: `${size.height}px`,
              border: "none",
              display: "block",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </Rnd>
  );
};

const Handle = () => (
  <div className="z-30 h-6 w-6 bg-white border-2 border-blue-500 shadow-sm" />
);

export default PageFrame;
