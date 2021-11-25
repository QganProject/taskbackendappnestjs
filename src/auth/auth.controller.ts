import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authServices: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authServices.signUp(authCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authServices.signIn(authCredentialsDto);
  }
  // Dummy Requests
  //   @Post('/test')
  //   @UseGuards(AuthGuard())
  //   test(@Req() req) {
  //     console.log(req);
  //   }
}
