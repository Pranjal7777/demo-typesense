import { Meta, StoryObj } from "@storybook/react";
import ButtonList from "./ButtonList";

const meta: Meta<typeof ButtonList> = {
  title: "Molecules/ButtonList",
  component: ButtonList,
  tags: ["autodocs"],
  // argTypes: {
  //   display: {
  //     control: "select",
  //     options: ["flex", "grid", "block", "inline", "inline-block", "inline-flex", "inline-grid", "inline-table", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row", "table-row-group"],
  //   },
  //   alignItems: {
  //     control: "select",
  //     options: ["center", "flex-start", "flex-end", "baseline", "stretch"],
  //   },
  //   justifyContent: {
  //     control: "select",
  //     options: ["center", "flex-start", "flex-end", "space-between", "space-around", "space-evenly"],
  //   },
  //   gap: {
  //     control: "text",
  //     description: "Gap between the buttons",
  //   },
  //   smGap: {
  //     control: "text",
  //     description: "Gap between the buttons for small screens",
  //   },
  //   mdGap: {
  //     control: "text",
  //     description: "Gap between the buttons for medium screens",
  //   },
  //   lgGap: {
  //     control: "text",
  //     description: "Gap between the buttons for large screens",
  //   },

  // },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    // alignItems: "center",
    // justifyContent: "start",
    // gap: "4",
  },
};

export const Secondary: Story = {
  args: {
    // alignItems: "center",
    // justifyContent: "start",
    // gap: "10",
  },
};
