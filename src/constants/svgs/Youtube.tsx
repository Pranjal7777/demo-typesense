import { SVGProps } from "@/types";
import React from "react";

const Youtube: React.FC<SVGProps> = ({
  width = 18,
  height = 13,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clip-path="url(#clip0_362_27313)">
        <g clip-path="url(#clip1_362_27313)">
          <path
            d="M16.9828 2.27433C16.7853 1.53633 16.2053 0.956364 15.4673 0.75881C14.131 0.400391 8.77022 0.400391 8.77022 0.400391C8.77022 0.400391 3.40947 0.400391 2.07316 0.75881C1.33516 0.956364 0.755193 1.53633 0.557638 2.27433C0.199219 3.61064 0.199219 6.40039 0.199219 6.40039C0.199219 6.40039 0.199219 9.19015 0.557638 10.5265C0.755193 11.2645 1.33516 11.8444 2.07316 12.042C3.40947 12.4004 8.77022 12.4004 8.77022 12.4004C8.77022 12.4004 14.131 12.4004 15.4673 12.042C16.2053 11.8444 16.7853 11.2645 16.9828 10.5265C17.3413 9.19015 17.3413 6.40039 17.3413 6.40039C17.3413 6.40039 17.3398 3.61064 16.9828 2.27433Z"
            fill="white"
          />
          <path
            d="M7.05469 8.97017L11.5081 6.39917L7.05469 3.82812V8.97017Z"
            fill="#112C2C"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_362_27313">
          <rect
            width="17.142"
            height="12"
            fill="white"
            transform="translate(0.199219 0.400391)"
          />
        </clipPath>
        <clipPath id="clip1_362_27313">
          <rect
            width="17.142"
            height="12"
            fill="white"
            transform="translate(0.199219 0.400391)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Youtube;
