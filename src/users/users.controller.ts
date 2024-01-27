import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { serialize } from 'src/interceptors/serialize/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('users')
@serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.name, body.email, body.password);
  }

  @Get()
  findAll(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    return this.userService.findOnBy(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(parseInt(id), body);
  }

  @Delete('/:id')
  destroy(@Param('id') id: string) {
    return this.userService.destroy(parseInt(id));
  }

  //   Auth
  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('/login')
  login(@Body() body: LoginUserDto) {
    return this.authService.login(body.email, body.password);
  }
}
