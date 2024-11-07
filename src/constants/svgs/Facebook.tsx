import { SVGProps } from "@/types";
import React from "react";

const Facebook: React.FC<SVGProps> = ({
  width = 16,
  height = 16,
  className,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_362_27284)">
        <mask
          id="mask0_362_27284"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="-8"
          y="-7"
          width="62"
          height="31"
        >
          <path
            d="M-7.29688 -6.65341H53.6813V23.1211H-7.29688V-6.65341Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_362_27284)">
          <path
            d="M15.0825 15.9395C15.5668 15.9395 15.9596 15.5467 15.9596 15.0623V0.923335C15.9596 0.438785 15.5668 0.0461197 15.0825 0.0461197H0.943563C0.459013 0.0461197 0.0664062 0.438785 0.0664062 0.923335V15.0623C0.0664062 15.5467 0.459013 15.9395 0.943563 15.9395H15.0825Z"
            fill="white"
          />
          <path
            d="M11.0325 15.9395V9.78476H13.0984L13.4077 7.38613H11.0325V5.85471C11.0325 5.16025 11.2253 4.68701 12.2212 4.68701L13.4914 4.68642V2.5411C13.2717 2.51193 12.5177 2.4466 11.6405 2.4466C9.80923 2.4466 8.55555 3.56439 8.55555 5.61723V7.38613H6.48438V9.78476H8.55555V15.9395H11.0325Z"
            fill="#112C2C"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_362_27284">
          <rect width="15.9999" height="16" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Facebook;
