import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const me = await prisma.user.findUnique({
      where: { userId: req.session.user?.userId },
      select: {
        id: true,
        userId: true,
        role: true,
      },
    });

    return res.json({ ok: true, me });
  } catch (error: any) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}

export default withApiSession(
  withHandler({
    methods: ['GET'],
    handler,
  })
);
