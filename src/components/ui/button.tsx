import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center fl-text-m ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/70",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/60",
        red: "bg-accent-red text-accent-red-foreground hover:bg-accent-red/60",
        blue: "bg-accent-blue text-accent-blue-foreground hover:bg-accent-blue/60",
        ghost: "border-0 hover:bg-accent hover:text-accent-foreground",
        link: "border-0 text-primary underline-offset-4 max-md:underline hover:underline",
      },
      size: {
        sm: "fl-py-3xs fl-px-s fl-text-step--1",
        default: "fl-py-3xs fl-px-l fl-text-step-0",
        lg: "fl-py-3xs fl-px-l fl-text-step-1",
        icon: "fl-w-l",
        unset: "",
      },
      font: {
        default: "font-marker",
        unset: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      font: "default",
    },
    compoundVariants: [
      {
        variant: ["default", "red", "blue", "secondary", "outline"],
        class:
          "border-black hover:-translate-y-1 hover:translate-x-1 transition pk-border",
      },
    ],
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
