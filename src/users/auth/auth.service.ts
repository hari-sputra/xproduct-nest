import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(name: string, email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('Email are registered');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.userService.create(name, email, result);
    return user;
  }

  async login(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('Email or Password wrong!');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Email or Password Wrong!');
    }

    return user;
  }
}
