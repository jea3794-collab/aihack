"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  colorClassName = "bg-primary",
  markerValue,
}: {
  value: number;
  colorClassName?: string;
  markerValue?: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setWidth(value));
    return () => cancelAnimationFrame(id);
  }, [value]);

  return (
    <div className="relative h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700 ease-out", colorClassName)}
        style={{ width: `${width}%` }}
      />
      {markerValue !== undefined && (
        <div
          className="absolute top-0 h-full w-0.5 bg-muted"
          style={{ left: `${markerValue}%` }}
          title={`${markerValue}%`}
        />
      )}
    </div>
  );
}
