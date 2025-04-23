"use client";

import * as React from "react";
import { useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchparams";
import { rupee } from "@/lib/Intl";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export function PriceRangeSliderSelect() {
  const [budgetRange, setBudgetRange] = useQueryState("budgetRange");

  const options = [
    { value: "0.500" },
    { value: "500.1000" },
    { value: "1000.1500" },
    { value: "1500.2000" },
    { value: "2000.2500" },
    { value: "2500.3000" },
    { value: "3000.3500" },
    { value: "3500.4000" },
    { value: "4000.4500" },
    { value: "4500.5000" },
  ];

  return (
    <div className="w-full max-w-sm space-y-4">
      <RadioGroup value={budgetRange} onValueChange={setBudgetRange}>
        {options.map((item, ind) => {
          const [min, max] = item.value.split(".");
          const label = `${rupee.format(min)} - ${rupee.format(max)}`;
          const id = `budget-${item.value.replace(/\./g, "-")}`;
          return (
            <div className="flex items-center space-x-2" key={ind}>
              <RadioGroupItem value={item.value} id={id} />
              <Label htmlFor={id} className="cursor-pointer">
                {label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {budgetRange && (
        <Button
          onClick={handleReset}
          type="button"
          aria-label="Reset mode selection"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
