import { Response } from 'express';
import { ApiResponse } from '../types/api';

export const sendResponse = <T>(
  res: Response, 
  data: T | null, 
  message: string = '', 
  status: number = 200
): void => {
  const response: ApiResponse<T> = {
    data,
    message
  };
  res.status(status).json(response);
};