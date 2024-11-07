import store from '@/store/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Poppins } from 'next/font/google';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
// lang Support Page
import { appWithTranslation } from 'next-i18next';
import { ThemeProvider } from '@/hooks/theme';
// import '../'

const poppins = Poppins({
  preload:true,
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <div>
          <main className={`${poppins.className} dark:bg-bg-primary-dark`}>
            <Toaster expand={false} position="bottom-right" richColors />
            
            <Component {...pageProps} />
          </main>
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default appWithTranslation(App);
