import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: Role;
  };
}

@Injectable()
export class RoleMiddleware implements NestMiddleware {
  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const user = req.user;
    
    if (!user) {
      throw new ForbiddenException('Acesso não autorizado');
    }

    // Check if user has required role for admin routes
    if (req.path.startsWith('/admin') && user.role !== Role.ADMIN) {
      throw new ForbiddenException('Acesso restrito a administradores');
    }

    next();
  }
}
