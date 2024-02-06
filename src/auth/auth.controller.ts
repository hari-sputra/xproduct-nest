import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dtos/login-user.dto';
import { UserDto } from 'src/users/dtos/user.dto';
import { serialize } from 'src/interceptors/serialize/serialize.interceptor';
import { CurrentUser } from './decorators/current-user/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user/current-user.interceptor';
import { User } from 'src/users/user.entity';

@Controller('auth')
@serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  //   Auth
  @Post('/register')
  async register(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(
      body.name,
      body.email,
      body.password,
    );

    session.userID = user.id;

    return user;
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);

    session.userID = user.id;

    return user;
  }

  @Post('/logout')
  logout(@Session() session: any) {
    session.userID = null;
  }

  @Get('/islogin')
  async isLogin(@CurrentUser() user: User) {
    return user;
  }
}
