import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, FirebaseAuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in with Email and Password' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new Tenant Organization & Owner' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('firebase')
  @ApiOperation({ summary: 'Exchange Firebase Auth Token for Platform JWT' })
  async firebaseAuth(@Body() dto: FirebaseAuthDto) {
    return this.authService.verifyFirebaseToken(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user profile with tenant data' })
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
