import theme from "@/constants/theme.json";
import { SVGProps } from "@/types";
import { FC } from "react";

const ArrowRight: FC<SVGProps> = ({
  width = "4",
  height = "8",
  className,
  pathFillColor = theme.colors.primary[500],
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 4 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.666504 7.33332V0.666656L3.99984 3.99999L0.666504 7.33332Z"
        fill={pathFillColor}
      />
    </svg>
  );
};
export default ArrowRight;
