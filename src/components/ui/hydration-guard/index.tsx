import React from 'react';
import { ReactNode, useEffect, useState } from 'react';

type HydrationGuardProps = {
  fallback?: ReactNode;
  children: ReactNode;
};

export const HydrationGuard: React.FC<HydrationGuardProps> = ({ fallback, children }) => {
  const [isHydrated, setIsHyderated] = useState(false);

  useEffect(() => {
    setIsHyderated(true);
  }, []);

  if (!isHydrated) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
};
