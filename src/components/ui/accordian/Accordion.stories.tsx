import type { Meta, StoryObj } from "@storybook/react";
import Accordion from "./Accordion";

const meta: Meta<typeof Accordion> = {
  title: "UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const sampleData = [
  {
    title: "Popular cuisines near me",
    content:
      "Arabian food, Bakery food, Beverages, Indian food, Chinese food, Desserts food, Ice Cream",
  },
  {
    title: "Popular restaurant types near me",
    content: "Casual Dining, Quick Bites, Delivery, Cafes, Fine Dining",
  },
  {
    title: "Top Restaurant Chains",
    content: "McDonald's, KFC, Burger King, Subway, Domino's",
  },
  {
    title: "Cities We Deliver To",
    content: "New York, Los Angeles, Chicago, Houston, Phoenix",
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
    allowMultiple: false,
  },
};

export const MultipleOpen: Story = {
  args: {
    data: sampleData,
    allowMultiple: true,
  },
};

export const CustomStyles: Story = {
  args: {
    data: sampleData,
    allowMultiple: false,
    className: "bg-gray-100",
    headerClassName: "bg-blue-50 hover:bg-blue-100",
    contentClassName: "bg-white",
  },
};

export const FirstItemNotOpen: Story = {
  args: {
    data: sampleData,
    allowMultiple: false,
    initialOpen: -1,
  },
};

export const CustomStyles2: Story = {
  args: {
    data: sampleData,
    allowMultiple: false,
    className: "flex flex-col gap-4",
    headerClassName: "hover:bg-blue-100",
    contentClassName: "bg-white",
  },
};
