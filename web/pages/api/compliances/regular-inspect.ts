import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const data = await prisma.queries.findMany({
      where: {
        category: 'COMPLIANCE',
      },
      include: {
        compliances: {
          // where: {
          //   registeredAt: {
          //     gte: new Date('2022-05'),
          //     lte: new Date('2022-05-30 23:59:59'),
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

    const newData = data.map((datum) => {
      const newDatum = datum.compliances.map((compliance) => {
        return {
          ...compliance,
          result: JSON.stringify({
            ...JSON.parse(compliance.result),
            registeredAt: compliance.registeredAt.toISOString().slice(0, 10),
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

    return res.status(200).json({ ok: true, data: newData });
  } catch (error: any) {
    console.log(`[/API/COMPLIANCES/REGULAR-INSPECT] ${error}`);
    return res.status(500).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
