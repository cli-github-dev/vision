import withHandler from '@libs/server/withHandler';
import { withApiSession } from '@libs/server/withSession';
import pgClient from '@libs/utils/pgClient';
import { Response } from '@_types/common-type';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  let data = [];
  try {
    data = (
      await pgClient?.query(`
        SELECT DISTINCT table_name 
        FROM information_schema.tables 
        WHERE table_catalog = 'steampipe' 
              AND table_type = 'FOREIGN'
      `)
    ).rows;
  } catch (error: any) {
    const { message: msg, code } = error;
    if (code === 'ECONNREFUSED') {
      return res.status(500).json({
        ok: false,
        error: "DB Connection error. Please check your steampipe's status",
      });
    }

    return res.status(500).json({ ok: false, error: msg });
  }

  return res.status(200).json({ ok: true, data });
}

export default withApiSession(withHandler({ methods: ['GET'], handler }));
