// icons
import { Icon } from '@iconify/react';
// @mui
import { Box, SxProps } from '@mui/material';
interface IconProps {
  icon: string;
  sx?: SxProps;
  [key: string]: any;
}

export default function Iconify({ icon, sx, ...other }: IconProps) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
