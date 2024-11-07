import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import InfoCard from '@/components/ui/info-card';

type InfoSectionProps = {
  title: string;
  items: string[];
};

const InfoSection = () => {
  const { t } = useTranslation('common');
  const infoSection = t('page.infoSection', { returnObjects: true }) as InfoSectionProps[];

  const [openCard, setOpenCard] = useState(0);

  const handleCardClick = (id: number) => {
    if (id === openCard) {
      setOpenCard(-1);
    } else {
      setOpenCard(id);
    }
  };

  return (
    <div className="lg:mt-[48px] mobile:py-0 mobile:my-9">
      {infoSection?.map((val, key) => (
        <InfoCard key={key} val={val} isOpen={openCard === key} onClick={handleCardClick} id={key} />
      ))}
    </div>
  );
};

export default InfoSection;
