import Description from '@/components/ui/description';
import { appClsx } from '@/lib/utils';
import React, { FC } from 'react';
import ContentSectionTitle from '../content-section-title';

export type Props = {
  title?: string;
  desc: string[];
  className?: string;
  sectionTitleClassName?: string;
  descriptionClassName?: string;
};

const ContentSection: FC<Props> = ({ title, desc, className, sectionTitleClassName, descriptionClassName }) => {
  return (
    <div className={appClsx('', className)}>
      {title && (
        <ContentSectionTitle className={appClsx('', sectionTitleClassName)} id={`${title}`}>
          {title}
        </ContentSectionTitle>
      )}
      <Description className={appClsx('', descriptionClassName)} desc={desc} />
    </div>
  );
};

export default ContentSection;
