import React, { ReactNode } from 'react';
import EngageStatCard from './engage-stats-card';

type EngagementStatsProps = {
  data: {
    logo?: ReactNode;
    label: string;
    value: string;
  }[];
};
const EngagementStats: React.FC<EngagementStatsProps> = ({ data }) => {
  return (
    <div className="flex h-[13.5%] mt-4 lg:mt-5 border border-border-tertiary-light dark:border-border-tertiary-dark rounded-[4px] py-3">
      {data.map((item, index) => (
        <div className="mx-auto" key={index}>
          <EngageStatCard logo={item.logo} label={item.label} value={item.value} />
        </div>
      ))}
    </div>
  );
};

export default EngagementStats;
