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
    // if user does not exist, exit logging to the console, `user with email ${email} does not exist`
    if (!user) {
      console.log(`User with email ${email} does not exists`);
      return;
    }
    // if user exists, extract password hash and match against provided password hash
    const isMatch = bcrypt.compare(password, user.getPassword());
    // if passwords do not match, exit logging to the console `invalid username/password`
    if (!isMatch) {
      console.log('Passwords do not match!');
    }
    // if passwords match log to the console `login successful`
    console.log('Login successful');
    return user;
  }
}
