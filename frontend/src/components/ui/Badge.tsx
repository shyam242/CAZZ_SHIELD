import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "danger" | "info" | "neutral" | "purple";
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className,
  dot = false,
  ...props
}) => {
  const variants = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    danger: "bg-red-500/10 text-red-400 border-red-500/30",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };

  const dotColors = {
    success: "bg-emerald-400",
    warning: "bg-amber-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
    neutral: "bg-slate-400",
    purple: "bg-purple-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[variant])} />}
      {children}
    </span>
  );
};
