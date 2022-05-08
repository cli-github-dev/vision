import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Popover as MuiPopover,
  Stack,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import useMutation from '@libs/hooks/useMutation';
import Button from './Button';
import { useSWRConfig } from 'swr';
import Snackbar from './Snackbar';
import { useRecoilValue } from 'recoil';
import { getApiUrlState, postApiUrlState } from '@libs/atoms';

export default function PopoverButton({
  id,
  width = 300,
  text,
  color = 'primary',
  size = 'medium',
}: {
  id: number;
  width?: number | string;
  [key: string]: any;
}) {
  const getApiUrl = useRecoilValue(getApiUrlState) || '';
  const postApiUrl = useRecoilValue(postApiUrlState) || '';
  const [anchor, setAnchor] = useState<{
    anchorEl: HTMLButtonElement | null;
    popno: number;
  }>({ anchorEl: null, popno: -1 });

  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ reason: string }>({ mode: 'onChange' });

  const [except, { loading, data: exceptData, error }] =
    useMutation(postApiUrl);

  const onValid = (id: number) => {
    return (exceptionForm: { reason: string }) => {
      if (loading) return;
      except({ ...exceptionForm, id });
    };
  };

  useEffect(() => {
    if (exceptData && exceptData.ok) {
      setAnchor({ anchorEl: null, popno: -1 });
      reset();
      mutate(getApiUrl);
    }
  }, [exceptData, reset, mutate, getApiUrl]);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    popno: number
  ) => {
    setAnchor({ anchorEl: event.currentTarget, popno });
  };

  const handleClose = () => {
    setAnchor({ anchorEl: null, popno: -1 });
  };

  return (
    <Stack
      justifyContent='center'
      alignItems='center'
      sx={{ minWidth: '100%' }}
    >
      <Button
        id={id}
        text={text}
        onClick={(e) => handleClick(e, id)}
        aria-describedby={id}
        sx={{ maxWidth: width }}
        color={color}
        size={size}
      />
      <MuiPopover
        id={String(id)}
        open={anchor.anchorEl !== null}
        anchorEl={anchor.anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ marginTop: 1 }}
      >
        <Stack
          direction='column'
          justifyContent='center'
          alignItems='center'
          sx={{ m: 1 }}
        >
          <Box
            component='form'
            onSubmit={handleSubmit(onValid(id))}
            sx={{ width }}
          >
            {error ? (
              <Alert variant='filled' severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : null}
            <TextField
              label='Reason'
              multiline
              rows={3}
              placeholder={'Input reason...'}
              sx={{ minWidth: width }}
              {...register('reason', {
                required: 'The Reason is required.',
                minLength: {
                  message: 'The Reason should be longer than 6 chars.',
                  value: 6,
                },
                maxLength: {
                  message: 'The Reason should be less than 255 chars.',
                  value: 255,
                },
              })}
              autoFocus
            />
            {errors.reason?.message ? (
              <Alert variant='filled' severity='error' sx={{ mt: 1 }}>
                {errors.reason?.message}
              </Alert>
            ) : null}
            <Button
              type='submit'
              text='Submit'
              sx={{
                minWidth: width,
                marginTop: 1,
              }}
              disabled={loading ? true : false}
            />
          </Box>
        </Stack>
      </MuiPopover>
      <Snackbar isOpen={!loading && exceptData} data={exceptData} />
    </Stack>
  );
}
