import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';

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
  async store(@Body() body, @Req() req) {
    const newUser = new User();
    newUser.setName(body.name);
    newUser.setEmail(body.email);
    newUser.setPassword(body.password);
    newUser.setRole('client');
    newUser.setBalance(1000);
    const user = await this.usersService.createOrUpdate(newUser);

    // expose the required user information to the session object in the request body
    req.session.user = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };
    // redirect to the default page - done implicitly using the `Redirect` decorator
  }

  @Get('/login')
  @Render('auth/login')
  login() {
    const viewData = [];
    viewData['title'] = 'User Login - Online Store';
    viewData['subtitle'] = 'User Login';
    return {
      viewData,
    };
  }

  @Post('/connect')
  async connect(@Body() body, @Req() req, @Res() res) {
    // extract request body
    // extract email and password fields
    const { email, password } = body;
    // pass them to the login userService method
    const user = await this.usersService.login(email, password);
    // if user does not exist, exit, redirecting back to login page
    if (!user) return res.redirect('/auth/login');
    // if user exits, populate session attribute of request with user information,
    req.session.user = {
      id: user.getId(),
      name: user.getName(),
      role: user.getRole(),
    };
    // then redirect to the default page
    return res.redirect('/');
  }

  @Get('/logout')
  @Redirect('/')
  logout(@Req() req) {
    // invalidate the session by clearing user information
    req.session.user = null;
    // redirect to the default page
  }
}
