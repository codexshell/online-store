import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createOrUpdate(user: User): Promise<User> {
    const hash = await bcrypt.hash(user.getPassword(), 10);
    user.setPassword(hash);
    return await this.usersRepository.save(user);
  }

  async login(email: string, password: string) {
    // check if user exists with the provided password
    const user = await this.usersRepository.findOne({ where: { email } });
    // if user does not exist, return the string user does not exist
    if (!user) {
      return `User with email "${email}" does not exist`;
    }
    // if user exists, extract password hash and match against provided password hash
    const isMatch = await bcrypt.compare(password, user.getPassword());
    // if passwords do not match, exit logging to the console `invalid username/password`
    if (!isMatch) {
      return 'Invalid credentials!';
    }
    // if passwords match return the user
    return user;
  }

  findOneById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  updateBalance(id: number, balance: number) {
    return this.usersRepository.update(id, { balance });
  }
}
