"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { useController } from "react-hook-form";

export function PriceRangeSlider({ min, max, step, name, control }) {
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: [min, max],
  });

  const handleRangeChange = (newRange) => {
    onChange(newRange);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Price Range</span>
        <span className="text-sm font-medium">
          ${value[0]} - ${value[1]}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={handleRangeChange}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>${min}</span>
        <span>${max}</span>
      </div>
    </div>
  );
}
