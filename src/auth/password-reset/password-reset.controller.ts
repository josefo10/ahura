import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { RequestPasswordResetDto } from './dto/request-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-reset.dto';

@Controller('auth/password-reset')
export class PasswordResetController {
  constructor(private readonly service: PasswordResetService) {}

  @Post('request')
  @HttpCode(HttpStatus.OK)
  request(@Body() body: RequestPasswordResetDto) {
    return this.service.request(body);
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  confirm(@Body() body: ConfirmPasswordResetDto) {
    return this.service.confirm(body);
  }
}
