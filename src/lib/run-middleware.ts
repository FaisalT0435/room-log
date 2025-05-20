import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * Turn a (req, res, next) middleware into a Promise.
 */
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, next: (err?: any) => void) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve();
    });
  });
}
