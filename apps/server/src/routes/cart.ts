import { Router, Request, Response } from 'express';

const router: Router = Router();

router.post('/', (_req: Request, res: Response) => {
  res.json({ message: 'Cart updated successfully' });
});

export default router;
