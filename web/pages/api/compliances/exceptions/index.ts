import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import prisma from '@libs/utils/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  // NOTE: GET
  if (req.method === 'GET') {
    const data = await prisma.queries.findMany({
      where: {
        category: 'COMPLIANCE',
      },
      include: {
        compliances: {
          where: {
            AND: [{ isDeleted: false }, { NOT: { exceptions: { none: {} } } }],
          },
          select: {
            id: true,
            result: true,
            // exceptions: {
            //   select: {
            //     registeredAt: true,
            //     reason: true,
            //     user: {
            //       select: {
            //         userId: true,
            //       },
            //     },
            //   },
            // },
          },
        },
      },
    });

    return res.status(200).json({ ok: true, data });
  }

  // NOTE: POST
  if (req.method === 'POST') {
    const {
      session: { user: { id } = {} },
      body: { id: complianceId, reason = '' },
    } = req;

    if (!complianceId || !reason || reason.length < 6)
      return res.status(400).json({
        ok: false,
        error: 'Id & Reason Required or Reason Length(min: 6) Too Short',
      });

    try {
      await prisma?.exception.create({
        data: {
          reason,
          user: {
            connect: { id },
          },
          compliance: {
            connect: { id: complianceId },
          },
        },
      });
    } catch (error: any) {
      // https://www.prisma.io/docs/reference/api-reference/error-reference
      if (error instanceof PrismaClientKnownRequestError) {
        // @ts-ignore
        const msg = error.meta
        console.log(`[/API/COMPLIANCES/EXCEPTIONS] [${error.code}] [${JSON.stringify(msg)}] ${error.message}`);
        return res.status(400).json({ ok: false, error: error.message });
      }

      console.log(`[/API/COMPLIANCES/EXCEPTIONS] ${error}`);
      return res.status(500).json({ ok: false, error: error.message });
    }

    return res.status(200).json({ ok: true, msg: 'Exception Succeeded' });
  }
}

export default withApiSession(
  withHandler({ methods: ['GET', 'POST'], handler })
);
