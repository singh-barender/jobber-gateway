import { verify } from 'jsonwebtoken';
import { config } from '@gateway/config';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@singh-barender/jobber-shared';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again.', 'GatewayService verifyUser() method error');
    }

    try {
      const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError(
        'Token is not available. Please login again.',
        'GatewayService verifyUser() method invalid session error'
      );
    }
    next();
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new BadRequestError('Authentication is required to access this route.', 'GatewayService checkAuthentication() method error');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
