import { SVGProps } from "@/types";
import { FC } from "react";

const GooglePlayIcon: FC<SVGProps> = ({
  width = "24",
  height = "26",
  className,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.33365 0.65625C1.04533 0.944588 0.949219 1.42515 0.949219 2.00183V23.2428C0.949219 23.8194 1.14144 24.3 1.42976 24.5883L1.52587 24.6844L13.4433 12.7665V12.5742L1.33365 0.65625Z"
        fill="url(#paint0_linear_362_27196)"
      />
      <path
        d="M17.2862 16.8024L13.3457 12.8618V12.5734L17.2862 8.63281L17.3823 8.72892L22.0916 11.4201C23.4371 12.189 23.4371 13.4385 22.0916 14.2074L17.2862 16.8024Z"
        fill="url(#paint1_linear_362_27196)"
      />
      <path
        d="M17.3822 16.7062L13.3456 12.6694L1.33203 24.6835C1.81258 25.1641 2.48534 25.1641 3.35032 24.7796L17.3822 16.7062Z"
        fill="url(#paint2_linear_362_27196)"
      />
      <path
        d="M17.3822 8.63316L3.35032 0.655791C2.48534 0.175227 1.81258 0.27134 1.33203 0.751904L13.3456 12.6699L17.3822 8.63316Z"
        fill="url(#paint3_linear_362_27196)"
      />
      <path
        opacity="0.2"
        d="M17.2861 16.6089L3.35032 24.4901C2.58145 24.9707 1.90868 24.8746 1.42814 24.4901L1.33203 24.5863L1.42814 24.6824C1.90868 25.0668 2.58145 25.1629 3.35032 24.6824L17.2861 16.6089Z"
        fill="black"
      />
      <path
        opacity="0.12"
        d="M1.33365 24.4923C1.04533 24.2039 0.949219 23.7234 0.949219 23.1467V23.2428C0.949219 23.8195 1.14144 24.3001 1.42976 24.5884V24.4923H1.33365ZM22.0931 13.9199L17.2877 16.611L17.3838 16.7071L22.0931 14.016C22.7659 13.6315 23.0542 13.151 23.0542 12.6704C23.0542 13.151 22.6698 13.5354 22.0931 13.9199Z"
        fill="black"
      />
      <path
        opacity="0.25"
        d="M3.35194 0.751614L22.0931 11.4201C22.6698 11.8046 23.0542 12.189 23.0542 12.6696C23.0542 12.189 22.7659 11.7085 22.0931 11.324L3.35194 0.655501C2.00642 -0.113401 0.949219 0.463275 0.949219 2.00108V2.09719C0.949219 0.655501 2.00642 -0.0172884 3.35194 0.751614Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_362_27196"
          x1="12.29"
          y1="1.81921"
          x2="-3.84057"
          y2="17.9482"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#00A0FF" />
          <stop offset="0.007" stop-color="#00A1FF" />
          <stop offset="0.26" stop-color="#00BEFF" />
          <stop offset="0.512" stop-color="#00D2FF" />
          <stop offset="0.76" stop-color="#00DFFF" />
          <stop offset="1" stop-color="#00E3FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_362_27196"
          x1="23.8542"
          y1="12.6705"
          x2="0.598802"
          y2="12.6705"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FFE000" />
          <stop offset="0.409" stop-color="#FFBD00" />
          <stop offset="0.775" stop-color="#FFA500" />
          <stop offset="1" stop-color="#FF9C00" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_362_27196"
          x1="15.1976"
          y1="14.8762"
          x2="-6.67571"
          y2="36.7486"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF3A44" />
          <stop offset="1" stop-color="#C31162" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_362_27196"
          x1="-1.65022"
          y1="-6.38351"
          x2="8.11772"
          y2="3.38402"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#32A071" />
          <stop offset="0.069" stop-color="#2DA771" />
          <stop offset="0.476" stop-color="#15CF74" />
          <stop offset="0.801" stop-color="#06E775" />
          <stop offset="1" stop-color="#00F076" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default GooglePlayIcon;
