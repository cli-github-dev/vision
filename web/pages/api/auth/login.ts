import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { PrismaClientInitializationError } from '@prisma/client/runtime';
import { Response } from '@_types/common-type';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  const { id: userId, password } = req.body;
  if (!userId || !password || userId.length < 3 || password.length < 8) {
    return res.status(400).json({ ok: false });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  if (!hashedPassword) {
    return res.status(400).json({ ok: false });
  }

  try {
    const countOfUser = await prisma.user.count({});

    const user = await prisma.user.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
        password: hashedPassword,
        // Take 'ADMIN' role when first logged in.
        role: countOfUser === 0 ? 'ADMIN' : 'USER',
      },
    });

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ ok: false });
    }

    req.session.user = {
      id: user.id,
      userId: user.userId,
      role: user.role,
    };
    await req.session.save();
  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      return res.status(500).json({
        ok: false,
        error: "Can't connect database, Please run database",
      });
    }
    return res.status(500).json({ ok: false, error });
  }

  return res.status(200).json({ ok: true });
}

export default withApiSession(
  withHandler({ methods: ['POST'], handler, isPrivate: false })
);
