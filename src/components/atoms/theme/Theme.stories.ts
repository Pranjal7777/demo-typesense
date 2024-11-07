
import { Meta, StoryObj } from "@storybook/react";
import  Theme  from "./Theme";

const meta: Meta<typeof Theme> = {
  title: "Atoms/Theme",
  component: Theme,
  tags: ["autodocs"],
  argTypes: {
    
  },
};

export default meta;

type Story = StoryObj<typeof Theme>;

export const Primary: Story = {};

