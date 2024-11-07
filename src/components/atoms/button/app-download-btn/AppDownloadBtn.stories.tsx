import { AppleIcon } from "@/constants/svgs";
import theme from "@/constants/theme.json";
import type { Meta, StoryObj } from "@storybook/react";
import AppDownloadBtn from "./AppDownloadBtn";

const meta: Meta<typeof AppDownloadBtn> = {
  title: "Molecules/AppDownloadBtn",
  component: AppDownloadBtn,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "Primary text displayed on the button",
    },
    subText: {
      control: "text",
      description: "Secondary text displayed below the primary text",
    },
    bgColor: {
      control: "color",
      description: "Custom background color for the button",
    },
    textColor: {
      control: "color",
      description: "Custom text color for the button",
    },
    href: {
      control: "text",
      description: "Link destination when button is clicked",
    },
    onClick: {
      action: "clicked",
      description: "Optional click handler",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppDownloadBtn>;

// Default variant
export const Default: Story = {
  args: {
    text: "GET IT ON",
    subText: "Google Play",
  },
};

// Custom colors
export const CustomColors: Story = {
  args: {
    text: "DOWNLOAD ON",
    subText: "Google Play Store",
    bgColor: "#4CAF50",
    textColor: "#FFFFFF",
  },
};

// Large size with custom class
export const Large: Story = {
  args: {
    text: "GET IT ON",
    subText: "Google Play",
    className: "scale-125",
  },
};

// Different text
export const AlternativeText: Story = {
  args: {
    text: "AVAILABLE ON",
    subText: "Play Store",
  },
};

// Dark Theme
export const DarkTheme: Story = {
  args: {
    text: "GET IT ON",
    subText: "Google Play",
    bgColor: "#1a1a1a",
    textColor: "#ffffff",
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const WhiteTheme: Story = {
  args: {
    text: "GET IT ON",
    subText: "Google Play",
    bgColor: "#ffffff",
    textColor: "#1a1a1a",
    icon: <AppleIcon pathFillColor={theme.colors.black} />,
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};
// Custom brand colors
export const BrandColors: Story = {
  args: {
    text: "DOWNLOAD NOW",
    subText: "Android App",
    bgColor: "#FF4081",
    textColor: "#FFFFFF",
  },
};
