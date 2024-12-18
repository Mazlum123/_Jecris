import { Request, Response, NextFunction } from 'express';

const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    userId: 'some-user-id',
  };
  next();
};

export default mockAuthMiddleware;