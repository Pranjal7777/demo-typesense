import { appClsx } from "@/lib/utils";
import React, { FC } from "react";

type PrimaryLogoProps = {
  width?: number;
  height?: number;
  primaryColor?: string;
  className?: string;
  logoType?: string;
  onClick?: () => void;
  secondaryColor?: string;
  ariaLabel?: string;
};

const PrimaryLogo: FC<PrimaryLogoProps> = ({
  width = 119,
  height = 38,
  primaryColor = "white",
  secondaryColor = 'var(--brand-color)',
  logoType = "primary",
  className,
  ariaLabel,
  ...props
}) => {
  
  return (
    <svg
      className={appClsx("fill-current", className)}
      width={width}
      height={height}
      {...props}
      viewBox="0 0 121 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
    >
      <g clipPath="url(#clip0_147_27)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.51861 6.32687H6.56757C6.63488 5.50931 6.81941 4.68302 7.10165 3.92214C7.83762 1.95126 9.25965 0.403334 11.4111 0.167875C11.5067 0.156974 11.6022 0.150434 11.6955 0.143893C11.8888 0.0981094 12.0885 0.0632265 12.2947 0.0414248C14.7371 -0.224557 16.5326 0.85027 17.7136 2.87783C18.2108 3.73246 18.5343 4.75497 18.7796 5.72296C18.8317 5.92354 18.8795 6.1263 18.9251 6.32687H23.6232L26.185 27.564L-0.00195312 27.6337L2.51861 6.32687ZM21.6236 18.0213C16.424 21.466 8.439 20.0097 4.4899 15.7213C4.82424 15.1784 5.32358 14.7358 5.85113 14.4895C4.07089 14.5025 3.06137 16.2249 4.15339 17.7292C3.99274 17.1514 4.07741 16.5759 4.30753 16.0635C8.97524 23.2472 17.477 25.0175 21.7561 18.2655C22.0535 18.8738 22.1599 19.5649 21.9645 20.2299C23.1759 18.6252 22.1208 16.7394 20.1951 16.6871C20.7704 16.9705 21.2828 17.448 21.6236 18.0192V18.0213ZM7.2102 6.32687H7.41861C7.4794 5.46788 7.67045 4.59581 7.97223 3.79569C8.1763 3.255 8.43031 2.74702 8.73643 2.28919C8.28486 2.82987 7.94617 3.46866 7.70302 4.12053C7.4425 4.81819 7.27533 5.57689 7.2102 6.32687ZM8.06124 6.32687H17.3684C17.3445 6.23967 17.3207 6.14374 17.2946 6.04127C17.0601 5.12996 16.754 4.1576 16.2829 3.35311C14.9369 1.05739 12.1363 -0.26162 9.98911 1.76376C9.33997 2.37421 8.87972 3.17216 8.57143 3.99408C8.29354 4.73098 8.11769 5.53765 8.06124 6.32905V6.32687ZM18.0414 6.32687H18.2586C18.226 6.18952 18.1912 6.04999 18.1587 5.91264C17.9264 5.00133 17.6246 4.02897 17.1557 3.2223C16.7345 2.50066 16.2352 1.91202 15.6446 1.48034C16.0962 1.90111 16.4935 2.41128 16.8409 3.0021C17.3424 3.85673 17.6702 4.87924 17.9177 5.84723C17.9655 6.02819 18.0045 6.18516 18.0414 6.32469V6.32687ZM18.4431 8.28031C17.9611 8.43292 17.6094 8.88422 17.6094 9.42054C17.6094 10.0811 18.1413 10.6153 18.7991 10.6153C19.457 10.6153 19.9889 10.0811 19.9889 9.42054C19.9889 8.87332 19.6241 8.4133 19.1226 8.27159C19.1834 8.65094 19.1878 9.04119 19.166 9.37912C19.1313 9.91108 18.4605 9.86748 18.4952 9.33552C18.5126 9.05645 18.5147 8.65748 18.4431 8.28249V8.28031ZM7.83979 8.25851C7.7117 8.22799 7.58578 8.21926 7.46204 8.23017C7.54671 8.58772 7.69868 8.93654 7.82026 9.17636C8.06124 9.65164 7.46421 9.95905 7.22105 9.48377C7.07342 9.19162 6.92579 8.84498 6.83244 8.48089C6.62836 8.64222 6.47422 8.87114 6.40909 9.14584C6.25712 9.78899 6.65441 10.4321 7.2927 10.5826C7.93315 10.7352 8.5736 10.3362 8.7234 9.69524C8.87537 9.05209 8.47808 8.40894 7.83979 8.25851Z"
          fill={secondaryColor}
        />
        {logoType == "primary" ? (
          <>
          <path
          className="dark:hidden"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.4177 27.6336H49.619L41.9162 15.8803L49.3563 6.27441H41.8966L35.8959 13.892V6.27441H29.5869V27.6336H35.8959V21.0059L37.3093 19.3533L42.4199 27.6336H42.4177ZM115.238 6.27441V27.6336H121V6.27441H115.238ZM108.714 12.3767V13.6783C107.661 12.6253 106.194 12.0105 104.279 12.0105C99.9195 12.0105 96.7954 15.2349 96.7954 20.0052C96.7954 24.7754 99.9195 27.9999 104.279 27.9999C106.194 27.9999 107.661 27.3851 108.714 26.332V27.6336H113.636V12.3767H108.714ZM105.328 22.5887C103.812 22.5887 102.77 21.5356 102.77 20.0052C102.77 18.4747 103.812 17.4282 105.328 17.4282C106.843 17.4282 107.878 18.4812 107.878 20.0052C107.878 21.5291 106.839 22.5887 105.328 22.5887ZM88.7061 12.0105C87.2581 12.0105 86.064 12.3615 85.1153 12.9915V6.27441H79.3534V27.6336H84.2751V26.332C85.328 27.3851 86.7913 27.9999 88.7061 27.9999C93.0721 27.9999 96.1962 24.7754 96.1962 20.0052C96.1962 15.2349 93.0721 12.0105 88.7061 12.0105ZM87.664 22.5887C86.1508 22.5887 85.1066 21.5356 85.1066 20.0052C85.1066 18.4747 86.1508 17.4217 87.664 17.4217C89.1772 17.4217 90.2215 18.4747 90.2215 20.0052C90.2215 21.5356 89.1772 22.5887 87.664 22.5887Z"
            fill={primaryColor}
          />
          <path
          className="hidden dark:inline-block"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.4177 27.6336H49.619L41.9162 15.8803L49.3563 6.27441H41.8966L35.8959 13.892V6.27441H29.5869V27.6336H35.8959V21.0059L37.3093 19.3533L42.4199 27.6336H42.4177ZM115.238 6.27441V27.6336H121V6.27441H115.238ZM108.714 12.3767V13.6783C107.661 12.6253 106.194 12.0105 104.279 12.0105C99.9195 12.0105 96.7954 15.2349 96.7954 20.0052C96.7954 24.7754 99.9195 27.9999 104.279 27.9999C106.194 27.9999 107.661 27.3851 108.714 26.332V27.6336H113.636V12.3767H108.714ZM105.328 22.5887C103.812 22.5887 102.77 21.5356 102.77 20.0052C102.77 18.4747 103.812 17.4282 105.328 17.4282C106.843 17.4282 107.878 18.4812 107.878 20.0052C107.878 21.5291 106.839 22.5887 105.328 22.5887ZM88.7061 12.0105C87.2581 12.0105 86.064 12.3615 85.1153 12.9915V6.27441H79.3534V27.6336H84.2751V26.332C85.328 27.3851 86.7913 27.9999 88.7061 27.9999C93.0721 27.9999 96.1962 24.7754 96.1962 20.0052C96.1962 15.2349 93.0721 12.0105 88.7061 12.0105ZM87.664 22.5887C86.1508 22.5887 85.1066 21.5356 85.1066 20.0052C85.1066 18.4747 86.1508 17.4217 87.664 17.4217C89.1772 17.4217 90.2215 18.4747 90.2215 20.0052C90.2215 21.5356 89.1772 22.5887 87.664 22.5887Z"
            fill={primaryColor}
          />
          </>
        ) : (
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M42.4177 27.6336H49.619L41.9162 15.8803L49.3563 6.27441H41.8966L35.8959 13.892V6.27441H29.5869V27.6336H35.8959V21.0059L37.3093 19.3533L42.4199 27.6336H42.4177ZM115.238 6.27441V27.6336H121V6.27441H115.238ZM108.714 12.3767V13.6783C107.661 12.6253 106.194 12.0105 104.279 12.0105C99.9195 12.0105 96.7954 15.2349 96.7954 20.0052C96.7954 24.7754 99.9195 27.9999 104.279 27.9999C106.194 27.9999 107.661 27.3851 108.714 26.332V27.6336H113.636V12.3767H108.714ZM105.328 22.5887C103.812 22.5887 102.77 21.5356 102.77 20.0052C102.77 18.4747 103.812 17.4282 105.328 17.4282C106.843 17.4282 107.878 18.4812 107.878 20.0052C107.878 21.5291 106.839 22.5887 105.328 22.5887ZM88.7061 12.0105C87.2581 12.0105 86.064 12.3615 85.1153 12.9915V6.27441H79.3534V27.6336H84.2751V26.332C85.328 27.3851 86.7913 27.9999 88.7061 27.9999C93.0721 27.9999 96.1962 24.7754 96.1962 20.0052C96.1962 15.2349 93.0721 12.0105 88.7061 12.0105ZM87.664 22.5887C86.1508 22.5887 85.1066 21.5356 85.1066 20.0052C85.1066 18.4747 86.1508 17.4217 87.664 17.4217C89.1772 17.4217 90.2215 18.4747 90.2215 20.0052C90.2215 21.5356 89.1772 22.5887 87.664 22.5887Z"
            fill={primaryColor }
          />
        )}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M65.3068 12.3768L63.5178 19.8941L61.4423 12.3768H57.2436L55.1681 19.8941L53.3857 12.3768H47.4805L52.489 27.6337H57.2588L59.3408 20.0925L61.4271 27.6337H66.1926L71.2054 12.3768H65.3068ZM74.8528 10.3689C76.6547 10.3689 78.1245 8.89507 78.1245 7.07898C78.1245 5.2629 76.6569 3.79346 74.8528 3.79346C73.0486 3.79346 71.581 5.2629 71.581 7.07898C71.581 8.89507 73.0443 10.3689 74.8528 10.3689ZM77.7294 12.3768H71.9718V27.6337H77.7294V12.3768Z"
          fill={secondaryColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_147_27">
          <rect width="121" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PrimaryLogo;
