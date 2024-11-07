import { MobileOutlineIcon } from "@/constants/svgs";
import theme from "@/constants/theme.json";
import type { Meta, StoryObj } from "@storybook/react";
import ButtonWithIcon from "./ButtonWithIcon";

const meta: Meta<typeof ButtonWithIcon> = {
  title: "Atoms/ButtonWithIcon",
  component: ButtonWithIcon,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    iconPosition: {
      control: "radio",
      options: ["left", "right"],
    },
    isLoading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonWithIcon>;

export const Default: Story = {
  args: {
    children: "Send Email",
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
  },
};

// Different variants
export const Destructive: Story = {
  args: {
    children: "Delete",
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Take Photo",
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    variant: "outline",
  },
};

// Different sizes
export const Small: Story = {
  args: {
    children: "Small",
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    size: "lg",
  },
};

export const IconOnly: Story = {
  args: {
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    size: "icon",
    "aria-label": "Home",
  },
};

// Icon position
export const RightIcon: Story = {
  args: {
    children: "Next",
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    iconPosition: "right",
  },
};

// Loading state
export const Loading: Story = {
  args: {
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    isLoading: true,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    children: "Disabled",
    icon: (
      <MobileOutlineIcon
        width="20"
        height="20"
        pathFillColor={theme.colors.primary[500]}
      />
    ),
    disabled: true,
  },
};

// Multiple variations demonstration
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
        >
          Default
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          variant="destructive"
        >
          Destructive
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          variant="outline"
        >
          Outline
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          variant="secondary"
        >
          Secondary
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          variant="ghost"
        >
          Ghost
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          variant="link"
        >
          Link
        </ButtonWithIcon>
      </div>
      <div className="flex gap-4">
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          size="sm"
        >
          Small
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
        >
          Default
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          size="lg"
        >
          Large
        </ButtonWithIcon>
        <ButtonWithIcon
          icon={
            <MobileOutlineIcon
              width="20"
              height="20"
              pathFillColor={theme.colors.primary[500]}
            />
          }
          size="icon"
          aria-label="Home"
        />
      </div>
    </div>
  ),
};
