import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  const {
    session: { user: { id, role } = {} },
    body: { category, type, name, query },
  } = req;
  // const compliances = await prisma.queries.findMany({
  //   include: {
  //     compliances: {
  //       where: {
  //         AND: [
  //           { isDeleted: false },
  //           { NOT: { exceptions: { none: {} } } },
  //           // {
  //           //   registeredAt: {
  //           //     gte: new Date('2022-04-01'),
  //           //   },
  //           // },
  //         ],
  //       },
  //       select: {
  //         id: true,
  //         result: true,
  //         registeredAt: true,
  //       },
  //     },
  //   },
  // });
  const countOfQueries = await prisma?.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            queries: true,
          }
        }
      }
    });
    console.log(countOfQueries?._count.queries);

  return res.status(200).json({ ok: true, countOfQueries });
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
