import Layout from '@components/Layout';
import Table from '@components/table/Table';
import { withSsrSession } from '@libs/server/withSession';
import { Queries, User } from '@prisma/client';
import prisma from '@libs/utils/prisma';
import { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import useTable from '@libs/hooks/useTable';
import { getMe } from '@libs/server/queries';

const RegularInspect: NextPage<{ me: User; data: Queries[] }> = ({
  me,
  data,
}) => {
  const router = useRouter();
  const { results, dataError, dataMsg, error } = useTable({
    getUrl: '/api/compliances/regular-inspect',
    postUrl: undefined,
    hasChip: true,
    previewData: data,
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
  let data = null;
  const userId = req?.session.user?.id;

  try {
    if (userId) {
      me = await getMe(userId);
    }

    if (me) {
      data = await prisma.queries.findMany({
        where: {
          category: 'COMPLIANCE',
        },
        include: {
          compliances: {
            // where: {
            //   registeredAt: {
            //     gte: new Date('2022-04-18'),
            //     lte: new Date('2022-04-30'),
            //   },
            // },
            select: {
              result: true,
              registeredAt: true,
              isDeleted: true,
              deletedAt: true,
              exceptions: {
                select: {
                  user: {
                    select: { userId: true },
                  },
                  reason: true,
                },
              },
            },
          },
        },
      });
    }
  } catch (error: any) {
    console.log(`[/COMPLIANCES/EXCEPTIONS] ${error}`);
  }

  if (!data) {
    return {
      props: {
        me,
        data: [],
      },
    };
  }

  const newData = data.map((datum) => {
    const newDatum = datum.compliances.map((compliance) => {
      return {
        ...compliance,
        result: JSON.stringify({
          ...JSON.parse(compliance.result),
          registeredAt: compliance.registeredAt,
          isDeleted: compliance.isDeleted ? 'USER_DELETED' : 'FALSE',
          userId: compliance.exceptions[0]?.user.userId ?? '',
          reason: compliance.exceptions[0]?.reason ?? '',
          isExcepted:
            compliance.exceptions.length !== 0 ? 'USER_EXCEPTED' : 'FALSE',
        }),
      };
    });
    return { ...datum, compliances: newDatum };
  });

  return {
    props: {
      me,
      data: JSON.parse(JSON.stringify(newData)),
    },
  };
});

export default RegularInspect;
