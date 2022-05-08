import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';

import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import Copyright from '@components/Copyright';
import Layout from '@components/Layout';
import useMutation from '@libs/hooks/useMutation';
import { withSsrSession } from '@libs/server/withSession';

import { User } from '@prisma/client';
import { getMe } from '@libs/server/queries';

interface LoginForm {
  id: string;
  password: string;
}

interface LoginResult {
  ok: boolean;
  error?: string;
}

const Login: NextPage<{ me: User }> = ({ me }) => {
  const router = useRouter();
  const [login, { loading, data, error }] =
    useMutation<LoginResult>('/api/auth/login');
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginForm>({
    defaultValues: {
      id: '',
      password: '',
    },
    mode: 'onChange',
  });

  const onValid = (loginForm: LoginForm) => {
    if (loading) return;
    login(loginForm);
  };

  useEffect(() => {
    if (me || data?.ok) router.replace('/queries/editor');
    if (!me) setFocus('id');
  }, [data, me, router, setFocus]);

  return (
    <Layout title='LOGIN' hasSidebar={false} userInfo={me}>
      {me ? null : (
        <Container
          component='main'
          maxWidth='xs'
          sx={{
            mt: '15%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon style={{ width: '30px', height: '30px' }} />
            </Avatar>
            <Typography component='h1' variant='h5'>
              Sign in
            </Typography>
            <Box
              component='form'
              onSubmit={handleSubmit(onValid)}
              noValidate
              sx={{ mt: 1, maxWidth: 'xs', width: '100%' }}
            >
              {/* SERVER ERROR */}
              {error || data?.error ? (
                <Alert variant='filled' severity='error' sx={{ mt: 1 }}>
                  {error || data?.error} <br />
                </Alert>
              ) : null}
              <TextField
                margin='normal'
                fullWidth
                label='ID'
                error={errors.id?.message ? true : false}
                {...register('id', {
                  required: 'The ID is required.',
                  minLength: {
                    message: 'The ID should be longer than 3 chars.',
                    value: 3,
                  },
                })}
              />
              {errors.id?.message ? (
                <Alert variant='filled' severity='error'>
                  {errors.id?.message}
                </Alert>
              ) : null}
              <TextField
                margin='normal'
                fullWidth
                label='PASSWORD'
                type='password'
                error={errors.password?.message ? true : false}
                {...register('password', {
                  required: 'The PASSWORD is required.',
                  minLength: {
                    message: 'The PASSWORD should be longer than 8 chars.',
                    value: 8,
                  },
                })}
              />
              {errors.password?.message ? (
                <Alert variant='filled' severity='error'>
                  {errors.password?.message}
                </Alert>
              ) : null}
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}
                disabled={loading ? true : false}
              >
                {loading ? (
                  <>
                    <CircularProgress color='inherit' size={24} />
                    &nbsp;&nbsp;Logging in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
              {data && !data?.error ? (
                <Alert
                  variant='filled'
                  severity={data?.ok ? 'success' : 'error'}
                >
                  {data?.ok ? 'Login Succeeded' : 'Login Failed'}
                </Alert>
              ) : null}
            </Box>
          </Box>
          <br />
          <Copyright />
        </Container>
      )}
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  let me = null;
  const userId = req?.session.user?.id;

  try {
    if (userId) me = await getMe(userId);
  } catch (error) {
    console.log(`[/] ${error}`);
  }

  return {
    props: {
      me,
    },
  };
});

export default Login;
