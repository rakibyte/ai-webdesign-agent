import React from 'react';
import { TOOL_MODE_ENUM, ToolModeType } from '@/constants/canvas';
import { Button } from '@/components/ui/button';
import { HandIcon, MinusIcon, MousePointer, PlusIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type PropsType = {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomPercent: number;
  toolMode: ToolModeType;
  setToolMode: (toolMode: ToolModeType) => void;
};

const CanvasControls = ({
  zoomIn,
  zoomOut,
  zoomPercent,
  toolMode,
  setToolMode,
}: PropsType) => {
  return (
    <div
      className="absolute bottom-10 -translate-x-1/2 left-1/2 flex items-center gap-2 rounded-full border bg-card py-1.5 px-4 shadow-md text-foreground z-40"
    >
      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "rounded-full cursor-pointer text-inherit hover:bg-secondary",
            toolMode === TOOL_MODE_ENUM.SELECT && "bg-secondary"
          )}
          onClick={() => setToolMode(TOOL_MODE_ENUM.SELECT)}
          title="Select Mode"
        >
          <MousePointer className="size-4" />
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "rounded-full cursor-pointer text-inherit hover:bg-secondary",
            toolMode === TOOL_MODE_ENUM.HAND && "bg-secondary"
          )}
          onClick={() => setToolMode(TOOL_MODE_ENUM.HAND)}
          title="Hand (Pan) Mode"
        >
          <HandIcon className="size-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-5" />

      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          className="rounded-full cursor-pointer text-inherit hover:bg-secondary"
          onClick={() => zoomOut()}
          title="Zoom Out"
        >
          <MinusIcon className="size-4" />
        </Button>
        <div className="min-w-10 text-center text-sm font-medium">{zoomPercent}%</div>
        <Button
          size="icon-sm"
          variant="ghost"
          className="rounded-full cursor-pointer text-inherit hover:bg-secondary"
          onClick={() => zoomIn()}
          title="Zoom In"
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default CanvasControls;
