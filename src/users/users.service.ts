import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(name: string, email: string, password: string) {
    const user = this.usersRepository.create({ name, email, password });
    return this.usersRepository.save(user);
  }

  find(email: string) {
    return this.usersRepository.find({
      where: {
        email,
      },
    });
  }

  async findOnBy(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOnBy(id);

    Object.assign(user, attrs);
    return this.usersRepository.save(user);
  }

  async destroy(id: number) {
    const user = await this.findOnBy(id);

    return this.usersRepository.remove(user);
  }
}
