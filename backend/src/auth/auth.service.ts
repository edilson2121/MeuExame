import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
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

    // Verificar se o email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Este email já está registado.');
    }

    // Verificar se a instituição existe (se foi fornecida)
    if (institutionId) {
      const institution = await this.prisma.institution.findUnique({
        where: { id: institutionId },
      });

      if (!institution) {
        throw new BadRequestException('Instituição não encontrada.');
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        institutionId: institutionId || null,
        // role já tem padrão USER no schema
      },
    });

    // Gerar token
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
