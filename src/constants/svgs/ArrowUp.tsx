import theme from "@/constants/theme.json";
import { SVGProps } from "@/types";
import { FC } from "react";

const ArrowUp: FC<SVGProps> = ({
  width = "12",
  height = "7",
  className,
  pathFillColor = theme.colors.black,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.99957 0.2925L11.6533 5.94625L10.5996 7L5.99957 2.4L1.39957 7L0.34582 5.94625L5.99957 0.2925Z"
        fill={pathFillColor}
      />
    </svg>
  );
};
export default ArrowUp;
