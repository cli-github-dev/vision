import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const data = await prisma.queries.findMany({
      where: {
        category: 'CUSTOM',
      },
      include: {
        resources: {
          select: { result: true },
        },
      },
    });

    return res.status(200).json({ ok: true, data });
  } catch (error: any) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
