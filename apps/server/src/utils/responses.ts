import { Response } from 'express';

export const sendResponse = <T>(
  res: Response, 
  data: T | null, 
  message: string = '', 
  status: number = 200
): void => {
  res.status(status).json({
    data,
    message
  });
};