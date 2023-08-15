import { Body, Controller, Get, Post, Redirect, Render } from '@nestjs/common';
import { User } from 'src/models/user.entity';

import { UsersService } from 'src/models/users.service';

@Controller('/auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Get('/register')
  @Render('auth/register')
  register() {
    const viewData = [];
    viewData['title'] = 'User Register - Online Store';
    viewData['subtitle'] = 'User Register';
    return {
      viewData,
    };
  }

  @Post('/store')
  @Redirect('/')
  async store(@Body() body) {
    const newUser = new User();
    newUser.setName(body.name);
    newUser.setEmail(body.email);
    newUser.setPassword(body.password);
    newUser.setRole('client');
    newUser.setBalance(1000);
    await this.usersService.createOrUpdate(newUser);
  }
}
