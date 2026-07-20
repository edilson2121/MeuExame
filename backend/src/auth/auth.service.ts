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
import { Response } from 'express';

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

  async googleAuthCallback(code: string, res: Response) {
    try {
      // Exchange code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
          grant_type: 'authorization_code',
        }),
      });

      const tokens = await tokenResponse.json();

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      const googleUser = await userResponse.json();

      // Check if user exists
      let user = await this.prisma.user.findUnique({
        where: { email: googleUser.email },
        include: { subscription: true },
      });

      if (!user) {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            name: googleUser.name,
            email: googleUser.email,
            password: await bcrypt.hash(Math.random().toString(36), 12),
            role: 'USER',
          },
          include: { subscription: true },
        });
      }

      // Generate JWT token
      const token = this.jwtService.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      const { password: _, ...result } = user;

      // Redirect to frontend with token
      res.redirect(`http://localhost:3000/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      res.redirect('http://localhost:3000/login?error=google_auth_failed');
    }
  }
}
