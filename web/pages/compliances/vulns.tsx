import Layout from '@components/Layout';
import Table from '@components/table/Table';
import { withSsrSession } from '@libs/server/withSession';
import { Compliance, User } from '@prisma/client';
import prisma from '@libs/utils/prisma';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import useTable from '@libs/hooks/useTable';
import { getMe } from '@libs/server/queries';

const Compliance: NextPage<{ me: User; compliances: Compliance[] }> = ({
  me,
  compliances,
}) => {
  const router = useRouter();
  const { results, dataError, dataMsg, error } = useTable({
    getUrl: '/api/compliances',
    postUrl: '/api/compliances/exceptions',
    buttonSettings: {
      isPopover: true,
      text: 'Exception',
      color: 'primary',
      size: 'medium',
    },
    previewData: compliances,
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
  let compliances = null;
  const userId = req?.session.user?.id;

  try {
    if (userId) {
      me = await getMe(userId);
    }

    if (me) {
      compliances = await prisma.queries.findMany({
        where: {
          category: 'COMPLIANCE',
        },
        include: {
          compliances: {
            where: {
              AND: [{ isDeleted: false }, { exceptions: { none: {} } }],
            },
            select: { id: true, result: true },
          },
        },
      });
    }
  } catch (error: any) {
    console.log(`[/COMPLIANCES/VULNS] ${error}`);
  }

  return {
    props: {
      me,
      compliances: JSON.parse(JSON.stringify(compliances)),
    },
  };
});

export default Compliance;
