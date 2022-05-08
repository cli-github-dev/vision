import { NextPage, NextPageContext } from 'next';

import Layout from '@components/Layout';
import { withSsrSession } from '@libs/server/withSession';
import { User } from '@prisma/client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import useTable from '@libs/hooks/useTable';
import { getMe } from '@libs/server/queries';
import Table from '@components/table/Table';

const Resources: NextPage<{ me: User; columns: any }> = ({ me, columns }) => {
  const router = useRouter();
  const { results, dataError, dataMsg, error } = useTable({
    getUrl: '/api/resources',
    postUrl: undefined,
    existsTitle: true,
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
  let columns = null;
  const userId = req?.session.user?.id;

  try {
    if (userId) me = await getMe(userId);
  } catch (error) {
    console.log(`[/RESOURCES] ${error}`);
  }

  return {
    props: {
      me,
      columns,
    },
  };
});

export default Resources;
