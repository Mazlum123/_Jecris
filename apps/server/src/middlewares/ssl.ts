export const requireSSL = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'production' && !req.secure) {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  };