// import {
//   locationPaths,
//   mobileLogoPaths,
//   searchIconPaths,
// } from "@/constants/svgs/svgPaths";
// import SVG, { SVGProps } from "./svgs/SVG";
// import { SVGProps as ReactSVGProps } from 'react';

import theme from "@/constants/theme.json";
import {
  LocationIcon,
  MobileOutlineIcon,
  SearchIcon,
  WebsiteLogo,
} from "./svgs";

// export const locationIcon = (
//   <SVG
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     paths={locationPaths}
//   />
// );

// export const mobileIcon = (
//   <SVG
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     paths={mobileLogoPaths}
//   />
// );

// export const searchIcon = (
//   <SVG
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     paths={searchIconPaths}
//   />
// );

export const websiteLogo = (
  <WebsiteLogo
    width="106"
    height="22"
    pathFillColor={theme.colors.white}
    className="lg:w-40 lg:h-9"
  />
);

export const LOCATION_ICON = (
  <LocationIcon
    width="20"
    height="20"
    pathFillColor={theme.colors.primary[500]}
    className="lg:w-6 lg:h-6"
  />
);
export const SEARCH_ICON = (
  <SearchIcon
    width="22"
    height="22"
    pathFillColor={theme.colors.black}
  />
);

export const mobileOutlineIcon = (
  <MobileOutlineIcon
    width="24"
    height="24"
    pathFillColor={theme.colors.white}
    className="lg:w-5 lg:h-5"
  />
);
