// import { Button, Typography } from "@/components/atoms";
// import { cn } from "@/utils";
// import { cva, VariantProps } from "class-variance-authority";
// import { ComponentProps, forwardRef } from "react";

// const buttonWithIconStyles = cva("w-full flex items-center gap-2");

// type ButtonWithIconProps = ComponentProps<"button"> &
//   VariantProps<typeof buttonWithIconStyles> & {
//     icon?: React.ReactNode;
//     variant?: "ghost" | "solid" | "outline";
//     size?: "sm" | "md" | "lg";
//   };

// const ButtonWithIcon = forwardRef<HTMLButtonElement, ButtonWithIconProps>(
//   ({ className, icon, children, variant, size, ...props }, ref) => {
//     return (
//       <Button
//         ref={ref}
//         className={cn(buttonWithIconStyles({ className }))}
//         variant={variant}
//         size={size}
//         {...props}
//       >
//         <Typography as="span" className="py-2">
//           {icon}
//         </Typography>
//         <Typography as="span" className="py-2">
//           {children}
//         </Typography>
//       </Button>
//     );
//   }
// );

// ButtonWithIcon.displayName = "ButtonWithIcon";

// export default ButtonWithIcon;

import { Button } from "@/components/atoms";
import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const buttonVariants = cva(
  "flex items-center justify-center gap-3 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        destructive: "",
        outline: "border",
        secondary: "",
        ghost: "",
        link: "text-primary-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "px-3 py-2 gap-0",
      },
      iconPosition: {
        left: "flex-row",
        right: "flex-row-reverse",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      iconPosition: "left",
    },
  }
);

export interface ButtonWithIconProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const ButtonWithIcon = React.forwardRef<HTMLButtonElement, ButtonWithIconProps>(
  (
    {
      className,
      children,
      variant,
      size,
      iconPosition,
      icon,
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        variant={"ghost"}
        className={cn(
          buttonVariants({ variant, size, iconPosition, className })
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="">Loading...</div>
        ) : (
          icon && (
            <span
              className={cn(
                "h-4 w-4 flex items-center justify-center",
                iconPosition === "left" ? "mr-2" : "ml-0"
              )}
            >
              {icon}
            </span>
          )
        )}
        <span>{children}</span>
      </Button>
    );
  }
);

ButtonWithIcon.displayName = "ButtonWithIcon";

export default ButtonWithIcon;
