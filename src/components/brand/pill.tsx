import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const pillVariants = cva("font-bold inline-block", {
  variants: {
    color: {
      default: "bg-primary/10 text-primary",
      muted: "bg-muted text-muted-foreground",
      red: "bg-accent-red/10 text-accent-red",
      blue: "bg-accent-blue/10 text-accent-blue",
    },
    size: {
      xs: "fl-px-2xs fl-py-3xs fl-text-step--2 rounded-sm",
      md: "fl-px-s fl-py-xs fl-text-step--1 rounded-lg",
      lg: "fl-px-s fl-py-xs fl-text-step-0 rounded-xl",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
});

export interface PillProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof pillVariants> {
  asChild?: boolean;
}

const Pill = React.forwardRef<HTMLSpanElement, PillProps>(
  ({ size, color, className, asChild = false, ...props }, ref) => {
    // if (!children) return null;
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={cn(pillVariants({ size, color, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

export default Pill;
