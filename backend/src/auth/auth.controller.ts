import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('admin/login')
  adminLogin(@Body() loginDto: LoginDto) {
    return this.authService.adminLogin(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('google')
  googleAuth(@Res() res: Response) {
    // Google OAuth redirect URL
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
      'client_id=' + process.env.GOOGLE_CLIENT_ID +
      '&redirect_uri=' + encodeURIComponent(process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback') +
      '&response_type=code' +
      '&scope=profile email';
    
    res.redirect(googleAuthUrl);
  }

  @Get('google/callback')
  googleAuthCallback(@Query('code') code: string, @Res() res: Response) {
    return this.authService.googleAuthCallback(code, res);
  }
}
