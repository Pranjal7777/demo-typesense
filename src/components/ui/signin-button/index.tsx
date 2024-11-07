import React, { FC } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/button';
import { gumletLoader } from '@/lib/gumlet';

interface IconSrc {
  black: string;
  white: string;
}

interface SignInButtonProps {
  onClick: () => void;
  iconSrc: IconSrc;
  iconAlt: string;
  children: React.ReactNode;
}

const SignInButton: FC<SignInButtonProps> = ({ onClick, iconSrc, iconAlt, children }) => (
  <Button buttonType='tertiary' onClick={onClick}>
    <Image className="absolute left-3 dark:hidden inline" width={20} height={20} src={iconSrc.black} loader={gumletLoader} alt={`${iconAlt}_black`} />
    <Image className="absolute left-3 dark:inline hidden" width={20} height={20} src={iconSrc.white} loader={gumletLoader} alt={`${iconAlt}_white`} />
    <span>{children}</span>
  </Button>
);

export default React.memo(SignInButton);
