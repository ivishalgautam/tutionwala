"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchparams";
import { rupee } from "@/lib/Intl";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

export function PriceRangeSliderSelect() {
  const [budgetRange, setBudgetRange] = useQueryState(
    "budgetRange",
    searchParams.budgetRange
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

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
      <RadioGroup defaultValue={budgetRange} onValueChange={setBudgetRange}>
        {options.map((item, ind) => {
          const labelArr = item.value.split(".");
          const label = `${rupee.format(labelArr[0])} - ${rupee.format(labelArr[1])}`;
          return (
            <div className="flex items-center space-x-2" key={ind}>
              <RadioGroupItem value={item.value} id={item.value} />
              <Label htmlFor={item.value} className=" cursor-pointer">
                {label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
}
