import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Se não houver roles requeridas, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // Buscar o usuário no banco para verificar o papel atual
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { role: true },
    });

    if (!dbUser) {
      throw new ForbiddenException('Usuário não encontrado');
    }

    const hasRole = requiredRoles.includes(dbUser.role);
    
    if (!hasRole) {
      throw new ForbiddenException('Acesso negado. Você não tem permissão para realizar esta ação.');
    }

    return true;
  }
}
