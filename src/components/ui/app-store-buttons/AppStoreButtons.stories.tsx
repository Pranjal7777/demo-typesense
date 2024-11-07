// AppStoreButtons.stories.tsx
import { AppleIcon, GooglePlayIcon } from "@/constants/svgs";
import theme from "@/constants/theme.json";
import type { Meta, StoryObj } from "@storybook/react";
import { AppDownloadBtn } from "../../atoms/button";
import AppStoreButtons from "./AppStoreButtons";

const meta: Meta<typeof AppStoreButtons> = {
  title: "UI/AppStoreButtons",
  component: AppStoreButtons,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Title above the app store buttons",
    },
    variant: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Layout orientation of the component",
    },
    googlePlayButton: {
      control: "object",
      description: "Props for Google Play button",
    },
    appStoreButton: {
      control: "object",
      description: "Props for App Store button",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppStoreButtons>;

// Default story
export const Default: Story = {
  args: {
    title: "Download the app",
  },
};

// Without title
export const WithoutTitle: Story = {
  args: {
    title: "",
  },
};

export const DarkTheme: Story = {
  args: {
    title: "Download the app",
    variant: "dark",
    googlePlayButton: (
      <AppDownloadBtn
        text="GET IT ON"
        subText="Google Play"
        icon={<GooglePlayIcon />}
        className="bg-white text-black"
      />
    ),
    appStoreButton: (
      <AppDownloadBtn
        text="GET IT ON"
        subText="App Store"
        href="https://www.apple.com/in/store"
        icon={<AppleIcon pathFillColor={theme.colors.black} />}
        className="bg-white text-black"
      />
    ),
  },
};
