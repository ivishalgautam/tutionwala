"use client";

import ErrorDisplay from "@/components/error-display";
import { useEffect, useState } from "react";

export default function Error({ error, reset }) {
  const [message, setMessage] = useState(null);
  useEffect(() => {
    setMessage(error?.message);
    console.error(error);
  }, [error]);

  return (
    <ErrorDisplay location={"Tutors Page"} message={message} reset={reset} />
  );
}
