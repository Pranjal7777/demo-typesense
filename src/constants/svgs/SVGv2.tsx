import React, { FC } from "react";
type PathData = {
  d: string;
  fill?: string;
  id: number;
};

type SVGProps = {
  width?: string;
  height?: string;
  className?: string;
  ariaLabel?: string;
  viewBox?: string;
  fill?: string;
  paths?: PathData[];
};

const SVG: FC<SVGProps> = ({
  width = "22",
  height = "22",
  fill = "none",
  viewBox = "0 0 24 24",
  paths,
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      {...props}
      className={className}
      viewBox={viewBox}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths?.map((path) => (
        <path key={path.id} d={path.d} fill={path.fill} />
      ))}
    </svg>
  );
};
export default SVG;
