import { Color } from '@mui/material';
import {
  Palette,
  PaletteColor,
  PaletteOptions,
  TypeBackground,
} from '@mui/material/styles';
import { Typography } from '@mui/material/styles/createTypography';

type NewColor = Omit<Color, 50 | 'A100' | 'A200' | 'A400' | 'A700'>;
type NewPalette = Omit<
  Palette,
  | 'grey'
  | 'action'
  | 'contrastThreshold'
  | 'tonalOffset'
  | 'getContrastText'
  | 'augmentColor'
  | 'mode'
> &
  Pick<PaletteOptions, 'action'>;
export type NewTypography = Omit<
  Typography,
  'fontSize' | 'fontWeightLight' | 'htmlFontSize' | 'pxToRem'
>;

export interface GreyColor extends NewColor {
  0: string;
  500_8: string;
  500_12: string;
  500_16: string;
  500_24: string;
  500_32: string;
  500_48: string;
  500_56: string;
  500_80: string;
}

export interface CustomPaletteColor extends PaletteColor {
  lighter: string;
  darker: string;
}

export interface Gradients {
  primary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

export interface ChartColors {
  violet: string[];
  blue: string[];
  green: string[];
  yellow: string[];
  red: string[];
}

export interface CustomPalette extends NewPalette {
  grey: GreyColor;
  gradients: Gradients;
  chart: ChartColors;
  background: TypeBackground & { neutral: GreyColor[200] };
}

export interface Response {
  ok: boolean;
  [key: string]: any;
}
