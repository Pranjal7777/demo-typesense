import React from 'react';

type ReportFlagProps = {
  fillColor?: string;
};

const ReportFlagSVG: React.FC<ReportFlagProps> = ({ fillColor = '#000' }) => {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_117_117053"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="28"
        height="28"
      >
        <rect width='28' height='28' />
      </mask>
      <g mask='url(#mask0_117_117053)'>
        <path
          d="M6.41699 24.2083V5.25H15.8623L16.329 7.58333H22.7503V18.0833H15.6383L15.1717 15.75H8.16699V24.2083H6.41699ZM17.092 16.3333H21.0003V9.33333H14.8753L14.4087 7H8.16699V14H16.6253L17.092 16.3333Z"
          fill={fillColor}
        />
      </g>
    </svg>
  );
};

export default ReportFlagSVG;
