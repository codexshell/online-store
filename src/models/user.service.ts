import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createOrUpdate(user: User) {
    const hash = await bcrypt.hash(user.getPassword(), 10);
    user.setPassword(hash);
    return await this.usersRepository.save(user);
  }
}
