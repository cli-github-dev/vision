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
          where: { AND: [{ isDeleted: false }, { exceptions: { none: {} } }] },
          select: { id: true, result: true },
        },
      },
    });

    return res.status(200).json({ ok: true, data });
  } catch (error: any) {
    console.log(`[/API/COMPLIANCES] ${error}`);
    return res.status(500).json({ ok: false, error: error.message });
  }
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
