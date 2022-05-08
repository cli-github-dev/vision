import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  // NOTE: GET
  if (req.method === 'GET') {
    try {
      const data = await prisma.queries.findMany({
        where: {
          user: {
            id: req?.session.user?.id,
          },
        },
        select: {
          category: true,
          type: true,
          name: true,
          query: true,
          registeredAt: true,
          _count: {
            select: {
              compliances: true,
              resources: true,
            },
          },
          id: true,
        },
      });

      return res.json({ ok: true, data });
    } catch (error: any) {
      console.log(`[/API/QURIES/COMPLIANCES] ${error}`);
      return res.status(500).json({ ok: false, error });
    }
  }

  // NOTE: POST
  if (req.method === 'POST') {
    const {
      session: { user: { id, role } = {} },
      body: { id: queryId },
    } = req;

    if (!queryId)
      return res.status(403).json({ ok: false, error: 'Wrong id of query' });

    try {
      if (role !== 'ADMIN') {
        const userQueries = await prisma?.user.findUnique({
          where: { id },
          select: {
            queries: {
              where: { id: queryId },
              select: { id: true },
            },
          },
        });
        if (userQueries?.queries.length === 0) return res.status(403).json({ ok: false, error: 'Not your query'})
      }
      
      await prisma?.queries.delete({
        where: { id: queryId },
      });

      return res.status(200).json({ ok: true, msg: 'Delete Succeeded' });
    } catch (error: any) {
      console.log(`[/API/QUERIES/MY-QUERIES] ${error}`);
      return res.status(500).json({ ok: false, error: error });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], handler })
);
