"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../database/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        return this.loginWithRole(loginDto, false);
    }
    async adminLogin(loginDto) {
        return this.loginWithRole(loginDto, true);
    }
    async loginWithRole(loginDto, adminOnly) {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                subscription: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        if (adminOnly && user.role !== 'ADMIN') {
            throw new common_1.UnauthorizedException('Esta rota é exclusiva para administradores');
        }
        if (!adminOnly && user.role === 'ADMIN') {
            throw new common_1.UnauthorizedException('Administradores devem entrar pela rota de admin');
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
    async register(registerDto) {
        const { name, email, password, phone, institutionId } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Este email já está registado.');
        }
        if (institutionId) {
            const institution = await this.prisma.institution.findUnique({
                where: { id: institutionId },
            });
            if (!institution) {
                throw new common_1.BadRequestException('Instituição não encontrada.');
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
    async googleAuthCallback(code, res) {
        try {
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
            const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });
            const googleUser = await userResponse.json();
            let user = await this.prisma.user.findUnique({
                where: { email: googleUser.email },
                include: { subscription: true },
            });
            if (!user) {
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
            const token = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
            });
            const { password: _, ...result } = user;
            res.redirect(`http://localhost:3000/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(result))}`);
        }
        catch (error) {
            res.redirect('http://localhost:3000/login?error=google_auth_failed');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map