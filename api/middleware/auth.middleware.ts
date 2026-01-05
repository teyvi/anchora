import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { Request, Response,NextFunction } from "express";

const INACTIVITY_LIMIT = 5 * 60 * 1000; //5 minutes

//typescript implementation
export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  //retrieve user session and check for validity
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    const session = await prisma.userSession.findUnique({
      where: { id: payload.sessionId },
    });
    if (!session || !session.isValid) return res.sendStatus(401);

    const inactiveTime = Date.now() - session.lastActivity.getTime();
    if (inactiveTime > INACTIVITY_LIMIT) return res.sendStatus(401);

    //Update activity
    await prisma.userSession.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    //Issue refreshed tokens
    const refreshToken = jwt.sign(
      {
        userId: payload.userId,
        role: payload.role,
        sessionId: session.id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );
    res.setHeader("x-refresh-token", refreshToken);
    req.user = payload;
    next();
  } catch {
    return res.sendStatus(401);
  }
}
