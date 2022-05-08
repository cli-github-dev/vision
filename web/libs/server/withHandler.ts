import { NextApiRequest, NextApiResponse } from 'next';

type method = 'GET' | 'POST' | 'DELETE';

interface HandlerProps {
  methods: method[];
  isPrivate?: boolean;
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
}

export default function withHandler({
  methods,
  isPrivate = true,
  handler,
}: HandlerProps) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as method)) {
      // Method not allowed.
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }
    if (isPrivate && !req.session.user) {
      // Unauthorized
      return res.status(401).json({ ok: false, error: 'Login Required' });
    }
    try {
      return handler(req, res);
    } catch (error: any) {
      const { message: msg } = error;
      console.log(`[WITHHANDLER] ${error}`);
      // Internal Server Error
      return res.status(500).json({ ok: false, error: msg });
    }
  };
}
