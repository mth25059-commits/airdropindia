"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  hover?: boolean;
  intensity?: "light" | "strong";
  children?: React.ReactNode;
};

export function GlassCard({
  className,
  children,
  hover = true,
  intensity = "light",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={cn(
        intensity === "strong" ? "glass-strong" : "glass",
        "group relative overflow-hidden rounded-2xl shadow-card",
        hover && "transition-colors hover:border-[var(--glass-border-strong)]",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {children}
    </motion.div>
  );
}
