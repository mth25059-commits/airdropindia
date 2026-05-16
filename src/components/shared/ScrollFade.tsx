"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollFadeProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  y?: number;
}

export function ScrollFade({
  className,
  children,
  delay = 0,
  y = 12,
  ...props
}: ScrollFadeProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...(props as object)}
    >
      {children}
    </motion.div>
  );
}
