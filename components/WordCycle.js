"use client";

import { useEffect, useRef, useState } from "react";

// Optional helper (not currently used on any page). Cycles through words with
// a fade. Timers are tracked and cleared on unmount to avoid stray updates.
export default function WordCycle({
  words = ["chicken", "eggs"],
  className = "",
  interval = 1900,
}) {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false);
      timeoutRef.current = setTimeout(() => {
        setI((v) => (v + 1) % words.length);
        setShow(true);
      }, 220);
    }, interval);
    return () => {
      clearInterval(id);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [words.length, interval]);

  return (
    <span
      className={`inline-block transition-opacity duration-200 ${
        show ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      {words[i]}
    </span>
  );
}
