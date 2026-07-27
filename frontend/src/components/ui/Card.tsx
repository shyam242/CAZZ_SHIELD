import React from "react";
import { cn } from "../../lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientBorder?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  gradientBorder = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#0f172a]/90 backdrop-blur-md border border-slate-800/80 p-5 text-slate-100 shadow-xl transition-all duration-200 hover:border-slate-700/80",
        gradientBorder && "border-transparent bg-gradient-to-r from-blue-600/30 via-slate-800 to-indigo-600/30 p-[1px]",
        className
      )}
      {...props}
    >
      {gradientBorder ? (
        <div className="bg-[#0f172a] p-5 rounded-[11px] h-full w-full">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3
    className={cn("text-lg font-semibold tracking-tight text-white flex items-center gap-2", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={cn("text-xs text-slate-400 font-mono", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("pt-0", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn("flex items-center pt-4 border-t border-slate-800/60 mt-4", className)} {...props}>
    {children}
  </div>
);
