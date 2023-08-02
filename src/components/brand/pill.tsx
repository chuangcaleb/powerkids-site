import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import React from "react";

const pillVariants = cva("bg-muted text-muted-foreground font-bold", {
  variants: {
    size: {
      xs: "px-1 py-0.5 text-xs rounded-sm",
      md: "fl-px-s fl-py-xs fl-text-step-0 rounded-lg",
      lg: "fl-px-m fl-py-s fl-text-step-1 rounded-xl",
    },
  },
  defaultVariants: {
    size: "xs",
  },
});

export interface PillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillVariants> {
  asChild?: boolean;
}

const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ size, className, asChild = false, ...props }, ref) => {
    // if (!children) return null;
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={cn(pillVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

export default Pill;
