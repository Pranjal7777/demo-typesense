import { cn } from "@/utils";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, forwardRef } from "react";

const buttonStyles = cva(
  [
    "rounded-md",
    "font-semibold",
    "focus:outline-none",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        solid: "",
        outline: "border-2",
        ghost: "transition-colors duration-300",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
      textColor: {
        primary: "text-white",
        secondary: "text-black",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    compoundVariants: [
      {
        variant: "solid",
        textColor: "primary",
        className: "bg-primary-500 hover:bg-primary-600",
      },
      {
        variant: "solid",
        textColor: "secondary",
        className: "bg-primary-500 hover:bg-primary-600",
      },
      {
        variant: "outline",
        textColor: "primary",
        className:
          "text-primary-600 border-primary-500 bg-transparent hover:bg-primary-100",
      },
      {
        variant: "outline",
        textColor: "secondary",
        className:
          "text-secondary-600 border-secondary-500 bg-transparent hover:bg-secondary-100",
      },
      {
        variant: "ghost",
        textColor: "primary",
        className: "text-primary-600 bg-transparent hover:bg-primary-100",
      },
      {
        variant: "ghost",
        textColor: "secondary",
        className: "text-secondary-600 bg-transparent hover:bg-secondary-100",
      },
    ],
    defaultVariants: {
      variant: "solid",
      size: "md",
      textColor: "primary",
      disabled: false,
    },
  }
);

type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonStyles>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, variant, size, textColor, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonStyles({ variant, size, textColor, className, disabled })
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
