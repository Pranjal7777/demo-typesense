import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      description: "The visual style of the button",
      defaultValue: "solid",
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "solid" },
      },
    },
    size: {
      description: "The size of the button",
      defaultValue: "md",
      control: { type: "select" },
      options: ["sm", "md", "lg"],
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "md" },
      },
    },
    textColor: {
      description: "The color scheme of the button",
      defaultValue: "primary",
      control: { type: "select" },
      options: ["primary", "secondary"],
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "primary" },
      },
    },
    children: {
      description: "The content to be displayed inside the button",
      control: { type: "text" },
      table: {
        type: { summary: "ReactNode" },
      },
    },
    className: {
      description: "Additional CSS classes to be applied to the button",
      control: { type: "text" },
      table: {
        type: { summary: "string" },
      },
    },
    disabled: {
      description: "Whether the button is disabled",
      control: { type: "boolean" },
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onClick: {
      description: "Function called when the button is clicked",
      action: "clicked",
      table: {
        type: { summary: "function" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    variant: "solid",
    children: "Solid Button",
    size: "md",
    textColor: "primary",
    disabled: false,
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
    size: "md",
    textColor: "primary",
    disabled: false,
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
    textColor: "primary",
    size: "md",
    disabled: false,
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
    textColor: "primary",
    disabled: false,
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
    textColor: "primary",
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
    size: "md",
    textColor: "primary",
  },
};

export const SecondaryColor: Story = {
  args: {
    textColor: "secondary",
    children: "Secondary Button",
    size: "md",
    disabled: false,
  },
};
