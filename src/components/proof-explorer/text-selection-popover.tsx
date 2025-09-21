// src/components/proof-explorer/text-selection-popover.tsx
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface TextSelectionPopoverProps {
  selectionRect: DOMRect;
  containerRef: React.RefObject<HTMLElement>;
  onExplain: () => void;
  onClose: () => void;
}

export function TextSelectionPopover({
  selectionRect,
  containerRef,
  onExplain,
  onClose,
}: TextSelectionPopoverProps) {
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  React.useEffect(() => {
    if (!selectionRect || !containerRef.current || !popoverRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    let top = selectionRect.top - containerRect.top - popoverRect.height - 8;
    const left = selectionRect.left - containerRect.left + selectionRect.width / 2 - popoverRect.width / 2;

    // If the popover would go off the top of the container, place it below the selection
    if (top < 0) {
      top = selectionRect.bottom - containerRect.top + 8;
    }

    setStyle({
      position: 'absolute',
      top: `${top}px`,
      left: `${Math.max(0, left)}px`, // Ensure it doesn't go off the left edge
      transform: 'translateX(0)', // Reset any previous transform
    });

  }, [selectionRect, containerRef]);

  // Close popover if clicked outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        // A small delay to allow the explain button to register its click
        setTimeout(() => onClose(), 100);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      style={style}
      className="z-20 p-1 bg-background border rounded-md shadow-lg"
    >
      <Button size="sm" onClick={onExplain}>
        <Sparkles className="h-4 w-4 mr-2" />
        Explain
      </Button>
    </div>
  );
}
