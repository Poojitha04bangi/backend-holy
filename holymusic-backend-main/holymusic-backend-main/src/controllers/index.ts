import { APP_NAME } from '@/config';
import { NextFunction, Request, Response } from 'express';

export const home = (_req: Request, res: Response, next: NextFunction) => {
  const smileEmoji = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣'];
  const emoji = smileEmoji[Math.floor(Math.random() * smileEmoji.length)];
  try {
    const payload = {
      emoji,
      message: `Welcome to the ${APP_NAME} API!`,
      timestamp: new Date().toISOString(),
      status: 200,
      success: true,
    };
    return res.status(200).json(payload);
  } catch (error) {
    next(error);
  }
};
export const fallback = (_req: Request, res: Response) => {
  const path = _req.path;
  const array = ['😭', '😢', '😥', '😓', '🤧', '😷', '🤒'];
  const emoji = array[Math.floor(Math.random() * array.length)];
  const payload = {
    emoji,
    status: 404,
    path: _req.path,
    error: 'Not Found',
    message: `The path ${path} doesn't exist on this server.`,
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(payload);
};
