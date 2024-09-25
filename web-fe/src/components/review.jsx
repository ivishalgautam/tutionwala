"use client";
import { Rating } from "@smastrom/react-rating";
import React from "react";
import "@smastrom/react-rating/style.css";
import { Muted } from "./ui/typography";

export default function Review({
  rating = Math.floor(Math.random() * 5),
  reviews = Math.floor(Math.random() * 10),
}) {
  return (
    <div className="flex items-center justify-start gap-1">
      <Rating style={{ maxWidth: 100 }} value={rating} readOnly />
      <Muted>({reviews} Reviews)</Muted>
    </div>
  );
}
