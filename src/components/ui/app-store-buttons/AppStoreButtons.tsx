import { AppleIcon, GooglePlayIcon } from "@/constants/svgs";
import { cn } from "@/utils";
import { cva } from "class-variance-authority";
import { FC } from "react";
import { Typography } from "@/components/atoms";
import { AppDownloadBtn } from "@/components/atoms/button";

export const storeButtonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "gap-3",
    "px-4",
    "py-2",
    "rounded-lg",
    "transition-colors",
    "duration-200",
    "hover:opacity-90",
  ],
  {
    variants: {
      variant: {
        default: ["bg-black", "text-white"],
        dark: "bg-white text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const containerVariants = cva(
  ["w-full", "flex", "flex-col", "items-start"],
  {
    variants: {
      variant: {
        horizontal: ["gap-4"],
        vertical: ["gap-2"],
      },
    },
    defaultVariants: {
      variant: "vertical",
    },
  }
);

export const buttonsContainerVariants = cva(["flex", "items-center", "gap-4"]);

export const headingVariants = cva(["font-semibold"], {
  variants: {
    variant: {
      default: "text-black",
      dark: "text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface AppStoreButtonsProps {
  title?: string;
  googlePlayButton?: React.ReactNode;
  appStoreButton?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  buttonsClassName?: string;
  headingClassName?: string;
  variant?: "default" | "dark";
  btnBgColor?: string;
  btnTextColor?: string;
  pathFillColorApple?: string;
}

const AppStoreButtons: FC<AppStoreButtonsProps> = ({
  title = "Download the app",
  variant = "default",
  btnBgColor,
  btnTextColor,
  pathFillColorApple,
  googlePlayButton = (
    <AppDownloadBtn
      text="GET IT ON"
      subText="Google Play"
      icon={<GooglePlayIcon />}
      variant={variant}
      bgColor={btnBgColor}
      textColor={btnTextColor}
    />
  ),
  appStoreButton = (
    <AppDownloadBtn
      text="GET IT ON"
      subText="App Store"
      href="https://www.apple.com/in/store"
      icon={<AppleIcon pathFillColor={pathFillColorApple} />}
      variant={variant}
      bgColor={btnBgColor}
      textColor={btnTextColor}
    />
  ),
  containerClassName,
  buttonsClassName,
  headingClassName,
}) => {
  return (
    <div className={cn(containerVariants(), containerClassName)}>
      {title && (
        <Typography
          as="h3"
          className={cn(headingVariants({ variant }), headingClassName)}
        >
          {title}
        </Typography>
      )}
      <div className={cn(buttonsContainerVariants(), buttonsClassName)}>
        {googlePlayButton}
        {appStoreButton}
      </div>
    </div>
  );
};

export default AppStoreButtons;
