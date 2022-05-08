import Layout from '@components/Layout';
import Table from '@components/table/Table';
import useTable from '@libs/hooks/useTable';
import { getMe } from '@libs/server/queries';
import { withSsrSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { Container, Typography } from '@mui/material';
import { User } from '@prisma/client';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Users: NextPage<{ me: User; users: User[] }> = ({ me, users }) => {
  const router = useRouter();
  const { results, dataError, dataMsg, error } = useTable({
    getUrl: '/api/users',
    postUrl: '/api/users/promote',
    buttonSettings: {
      isPopover: false,
      text: 'Promote',
      color: 'info',
      size: 'medium',
    },
    previewData: users,
    existsTitle: false,
  });

  useEffect(() => {
    if (!me) router.replace('/');
  }, [me, router]);

  return (
    <Layout title='TABLE' userInfo={me}>
      {me ? (
        <Table rows={10} />
      ) : (
        <Container
          sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant={'h3'}>
            {me && !results ? 'No data for viewing.' : 'Login Required'}
          </Typography>
        </Container>
      )}
    </Layout>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  let me = null;
  let users = null;
  const userId = req?.session.user?.id;

  try {
    if (userId) {
      me = await getMe(userId);

      users = await prisma.user.findMany({
        select: {
          id: true,
          userId: true,
          role: true,
          createdAt: true,
        },
      });
    }
  } catch (error) {
    console.log(`[/USERS] ${error}`);
  }

  return {
    props: {
      me,
      users: JSON.parse(JSON.stringify(users)),
    },
  };
});

export default Users;
