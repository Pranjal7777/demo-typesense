import React from 'react';
import ShareIconSVG from '../../../../public/assets/svg/share-icon';

type ShareButtonProps = {
    title?: string;
    url:string
}
const ShareButton: React.FC<ShareButtonProps> = ({title, url}) => {
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: 'Product from LeOffer',
          url: url,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing not supported.');
    }
  };

  return (
    <div className="mt-2 cursor-pointer" onClick={handleShareClick} tabIndex={0} role='button'  onKeyUp={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleShareClick();
      }
    }}>
      <ShareIconSVG />
    </div>
  );
};

export default ShareButton;
