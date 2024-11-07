import { GUMLET_API_URL } from '@/config';
type GumletLoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export const gumletLoader = ({ src, width, quality = 90 }: GumletLoaderParams) => {
  return `${GUMLET_API_URL}/${src}?w=${width}&q=${quality}`;
};
