import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { serialize } from 'src/interceptors/serialize/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('users')
@serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.name, body.email, body.password);
  }

  @Get()
  findAll() {
    return this.userService.find();
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
}
