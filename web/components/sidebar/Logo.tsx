import { Box } from '@mui/material';
import { SxProps } from '@mui/system';

interface LogoProps {
  sx?: SxProps;
}

export default function Logo({ sx }: LogoProps) {
  return (
    <Box
      component='img'
      src='/logo.svg'
      sx={{ width: 40, height: 40, ...sx }}
    />
  );
}
