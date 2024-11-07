import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';

type EngageStatCardProps = {
  logo: ReactNode;
  label: string;
  value: string;
};

const EngageStatCard: React.FC<EngageStatCardProps> = ({ logo, label, value }) => {
  return (
    <div className=" py-[0rem] px-[1rem] mobile:px-8  text-text-primary-light dark:text-text-primary-dark flex gap-[4px] flex-col items-center">
      <div className="flex gap-[5px] items-center">
        {logo} 
        <p className="text-xs md:text-sm font-normal ">{label}</p>
      </div>
      <p className="text-lg md:text-xl font-semibold">{value ? value : '0'}</p>
    </div>
  );
};

EngageStatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};
export default EngageStatCard;
