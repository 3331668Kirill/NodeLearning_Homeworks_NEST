import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('login')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async auth(@Body() body: { login: string; password: string }) {
    const checkResult = await this.authService.checkCredentials(
      body.login,
      body.password,
    );
    if (checkResult.resultCode === 0) {
      return checkResult.data;
    } else {
      throw new UnauthorizedException();
    }
  }
}
