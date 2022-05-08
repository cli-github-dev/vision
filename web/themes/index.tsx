import { useMemo } from 'react';
// material
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
} from '@mui/material/styles';
//
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

// ----------------------------------------------------------------------

interface ThemeConfigProps {
  children: React.ReactNode;
}

export default function ThemeConfig({ children }: ThemeConfigProps) {
  const themeOptions = useMemo<ThemeOptions | { shadows: string[] }>(
    () => ({
      palette,
      shape: { borderRadius: 8 },
      typography,
      shadows,
      customShadows,
    }),
    []
  );

  // @ts-ignore
  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
}
