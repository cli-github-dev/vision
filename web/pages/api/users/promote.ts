import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  const {
    body: { id: requestedUserId },
    session: { user: { id, role } = {} },
  } = req;

  if (role !== 'ADMIN')
    return res.status(403).json({ ok: false, error: 'You`re not ADMIN' });

  try {
    const user = await prisma?.user.findUnique({
      where: { id: requestedUserId },
      select: {
        role: true,
      },
    });
    if (!user) return res.status(400).json({ ok: false, error: 'Wrong User' });

    if (user.role === 'ADMIN')
      return res.status(403).json({ ok: false, error: 'It`s already ADMIN' });

    await prisma?.user.update({
      where: { id: requestedUserId },
      data: {
        role: 'ADMIN',
      },
    });
    return res.json({ ok: true, msg: 'Promoted' });
  } catch (error: any) {
    console.log(`[/API/USERS/PROMOTE] ${error}`);
    return res.status(500).json({ ok: false, error });
  }
}

export default withApiSession(withHandler({ methods: ['POST'], handler }));
