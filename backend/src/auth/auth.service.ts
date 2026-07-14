import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    return this.loginWithRole(loginDto, false);
  }

  async adminLogin(loginDto: LoginDto) {
    return this.loginWithRole(loginDto, true);
  }

  private async loginWithRole(loginDto: LoginDto, adminOnly: boolean) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (adminOnly && user.role !== 'ADMIN') {
      throw new UnauthorizedException('Esta rota é exclusiva para administradores');
    }

    if (!adminOnly && user.role === 'ADMIN') {
      throw new UnauthorizedException('Administradores devem entrar pela rota de admin');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...result } = user;

    return {
      user: result,
      token,
    };
  }

  async register(registerDto: RegisterDto) {
    const { name, email, password, phone, institutionId } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Este email já está registado.');
    }

    if (institutionId) {
      const institution = await this.prisma.institution.findUnique({
        where: { id: institutionId },
      });

      if (!institution) {
        throw new BadRequestException('Instituição não encontrada.');
      }
    }

    const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
    const hashedPassword = await bcrypt.hash(password, rounds);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        institutionId: institutionId || null,
      },
    });

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: _, ...result } = user;

    return {
      user: result,
      token,
    };
  }
}
