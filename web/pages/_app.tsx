import { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '@src/createEmotionCache';

import { SWRConfig } from 'swr';
import { RecoilRoot } from 'recoil';
import ThemeConfig from '@themes/index';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeConfig>
        <CssBaseline />
        <SWRConfig
          value={{
            fetcher: (url: string) =>
              fetch(url).then((response) => response.json()),
          }}
        >
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </SWRConfig>
      </ThemeConfig>
    </CacheProvider>
  );
}
