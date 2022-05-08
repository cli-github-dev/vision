import { useEffect, useState } from 'react';
import { Alert, Snackbar as MuiSnackbar, Stack } from '@mui/material';

export default function Snackbar({
  isOpen,
  data,
  ...rest
}: {
  isOpen: boolean;
  data: any;
  [key: string]: any;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setOpen((prev) => !prev);
  }, [isOpen]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <MuiSnackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        {...rest}
      >
        <Alert
          onClose={handleClose}
          variant='filled'
          severity={data?.ok ? 'success' : 'error'}
          sx={{ maxWidth: '400px' }}
        >
          {data?.ok ? data?.msg : data?.error}
        </Alert>
      </MuiSnackbar>
    </Stack>
  );
}
