import theme from "@/constants/theme.json";
import { SVGProps } from "@/types";
import { FC } from "react";

const ArrowDown: FC<SVGProps> = ({
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
        d="M6.00043 6.7075L0.34668 1.05375L1.40043 0L6.00043 4.6L10.6004 0L11.6542 1.05375L6.00043 6.7075Z"
        fill={pathFillColor}
      />
    </svg>
  );
};
export default ArrowDown;
