import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost" | "warning";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className,
  icon,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 focus:ring-blue-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 focus:ring-red-500",
    warning: "bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/20 focus:ring-amber-500",
    outline: "border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white bg-transparent focus:ring-slate-500",
    ghost: "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white focus:ring-slate-500",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
