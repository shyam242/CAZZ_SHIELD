import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1.5 w-full">
        {label && (
          <label className="text-xs font-mono font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-lg bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors",
              icon ? "pl-9 pr-3" : "px-3",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
