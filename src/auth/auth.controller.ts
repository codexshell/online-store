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
import { UserValidator } from 'src/validators/user.validator';

@Controller('/auth')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @Get('/register')
  @Render('auth/register')
  register() {
    const viewData = [];
    viewData['title'] = 'User Register - Online Store';
    viewData['subtitle'] = 'User Register';
    viewData['path'] = {
      register: 'active',
    };

    return {
      viewData,
    };
  }

  @Post('/register')
  async store(@Body() body, @Req() req, @Res() res) {
    // validate the request body
    const toValidate: string[] = ['name', 'email', 'password'];
    const errors: string[] = UserValidator.validate(body, toValidate);
    if (errors.length > 0) {
      // update the session attribute on the request body with the errors
      req.session.flashErrors = errors;
      // redirect to the user registration page
      return res.redirect('/auth/register');
    } else {
      // check if user already exits
      const response = await this.usersService.findOneByEmail(req.body.email);
      if (response instanceof User) {
        req.session.flashErrors = [
          'Email already taken! Please provide an alternative email or login',
        ];
        return res.redirect('/auth/register');
      }
      // create a new user and store in database
      const newUser = new User();
      newUser.setName(body.name);
      newUser.setEmail(body.email);
      newUser.setPassword(body.password);
      newUser.setRole('client');
      newUser.setBalance(1000);
      const user = await this.usersService.createOrUpdate(newUser);
      // update the session attribute on the request object with user information
      req.session.user = {
        id: user.getId(),
        name: user.getName(),
        role: user.getRole(),
      };
      // redirect to the default page
      return res.redirect('/');
    }
  }

  @Get('/login')
  @Render('auth/login')
  login() {
    const viewData = [];
    viewData['title'] = 'User Login - Online Store';
    viewData['subtitle'] = 'User Login';
    viewData['path'] = {
      login: 'active',
    };

    return {
      viewData,
    };
  }

  @Post('/login')
  async connect(@Body() body, @Req() req, @Res() res) {
    // extract request body
    // extract email and password fields
    const { email, password } = body;
    // pass them to the login userService method
    const result = await this.usersService.login(email, password);
    // if user does not exist, exit, redirecting back to login page showing errors
    if (!(result instanceof User)) {
      req.session.flashErrors = [result];
      return res.redirect('/auth/login');
    }
    // if user exits, populate session attribute of request with user information,
    if (result instanceof User)
      req.session.user = {
        id: result.getId(),
        name: result.getName(),
        role: result.getRole(),
        isAdmin: result.getRole() === 'admin',
      };
    // if user was in a redirect process, proceed with redirection,
    // else redirect to default page
    if (req.session.redirect) {
      const redirect = req.session.redirect;
      delete req.session.redirect;
      return res.redirect(redirect);
    }
    return res.redirect('/');
  }

  @Get('/logout')
  @Redirect('/auth/login')
  logout(@Req() req) {
    // invalidate the session by clearing user information
    req.session.user = null;
    // redirect to the default page
  }
}
