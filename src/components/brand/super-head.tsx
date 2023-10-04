import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

const superHeadVariants = cva("font-bold inline-block", {
  variants: {
    color: {
      default: " text-primary",
      muted: "text-muted-foreground",
      red: "text-accent-red",
      blue: "text-accent-blue",
    },
    size: {
      xs: "fl-text-step-0",
      md: "fl-text-step-1",
      lg: "fl-text-step-2",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
});

export interface superHeadProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof superHeadVariants> {
  asChild?: boolean;
}

const SuperHead = React.forwardRef<HTMLSpanElement, superHeadProps>(
  ({ size, color, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={cn(superHeadVariants({ size, color, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

export default SuperHead;
