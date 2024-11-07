import React from 'react';
import NextNProgress from 'nextjs-progressbar';

interface ProgressBarProps {
  color: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ color }) => {
  return <NextNProgress color={color} options={{ easing: 'ease', speed: 500, showSpinner: false }} height={3} />;
};

export default ProgressBar;
