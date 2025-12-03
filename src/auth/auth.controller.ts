import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInDto } from './DTO/signIn.dto';
import { SingUpDto } from './DTO/signUp.dto';
import { ResetPasswordDto } from './DTO/resetPassword.dto';
import { VerifyDto } from './DTO/verifyCode.dto';
import { ChangePasswordDto } from './DTO/changePassword.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { Roles } from 'src/user/decorator/Roles.decorator';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('sign-up')
  async signUp(@Body() signUpDto: SingUpDto) {
    return await this.authService.signUp(signUpDto)
  }

  @Post('sign-in')
  async signIn(@Body() signInDto: SingInDto) {
    return await this.authService.signIn(signInDto);
  }
//reset password
//NOTES   //Security Enhancements in obsidian if you want
//1
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto)
  }
//2
@Post('verify-code')
async verifyCode(@Body() verifyDto:VerifyDto){
    return await this.authService.verifyCode(verifyDto);
}
//3
@Roles(['admin','user'])
@UseGuards(AuthGuard)
@Post('change-password')
async changePassword(@Body() changePasswordDto:ChangePasswordDto){
  return await this.authService.changePassword(changePasswordDto);
}
//reset password

}
