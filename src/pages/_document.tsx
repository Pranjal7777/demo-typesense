import { GUMLET_API_URL } from '@/config';
import { IMAGES } from '@/lib/images';
import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Expo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="preload" as="image" href={`${GUMLET_API_URL}/${IMAGES.PRIMARY_BANNER}`}></link>
      </Head>
      <body>
        <Main />
        <NextScript>
          <script async src="https://maps.googleapis.com/maps/api/js?sensor=false"></script> 

        </NextScript>
      </body>
    </Html>
  );
}
