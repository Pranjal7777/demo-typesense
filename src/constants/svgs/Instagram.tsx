import { SVGProps } from "@/types";
import React from "react";


const Instagram: React.FC<SVGProps> = ({
  width = 16,
  height = 17,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_362_27305)">
        <path
          d="M12.7957 16.0508H3.20772C1.44992 16.0508 0.0117188 14.6126 0.0117188 12.8548V3.24679C0.0117188 1.48898 1.44992 0.0507812 3.20772 0.0507812H12.7957C14.5535 0.0507812 15.9917 1.48898 15.9917 3.24679V12.8348C16.0117 14.5926 14.5535 16.0508 12.7957 16.0508Z"
          fill="white"
        />
        <path
          d="M10.1705 13H5.81195C4.26538 13 3 11.7346 3 10.188V5.81195C3 4.26538 4.26538 3 5.81195 3H10.188C11.7346 3 13 4.26538 13 5.81195V10.188C13 11.717 11.717 13 10.1705 13Z"
          stroke="#112C2C"
          strokeWidth="0.80002"
          strokeMiterlimit="10"
        />
        <path
          d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
          stroke="#112C2C"
          strokeWidth="0.80002"
          strokeMiterlimit="10"
        />
        <path
          d="M11 6C11.5523 6 12 5.55228 12 5C12 4.44772 11.5523 4 11 4C10.4477 4 10 4.44772 10 5C10 5.55228 10.4477 6 11 6Z"
          fill="#112C2C"
        />
      </g>
      <defs>
        <clipPath id="clip0_362_27305">
          <rect
            x="0.0117188"
            y="0.0507812"
            width="15.9802"
            height="16"
            rx="4"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Instagram;
