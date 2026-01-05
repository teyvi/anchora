import { Request, Response, NextFunction } from "express";
 export const requireAdmin = (
req: Request,
  res: Response,
  next: NextFunction
) => {
    if (req.user?.role !== 'ADMIN'){
        return res.status(403).json({
            error: 'FORBIDDEN',
            message: 'Admin access required'
        })
    }
    next()
}