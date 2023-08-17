import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  index() {
    const viewData: Record<string, any> = [];

    viewData['title'] = 'Home Page - Online Store';
    viewData['path'] = {
      home: 'active',
    };

    return {
      viewData,
    };
  }

  @Get('/about')
  @Render('about')
  about() {
    const viewData: Record<string, any> = [];

    viewData['title'] = 'About us - Online Store';
    viewData['subtitle'] = 'About us';
    viewData['description'] = 'This is an about page';
    viewData['author'] = 'Developed by: Eric';
    viewData['path'] = {
      about: 'active',
    };

    return {
      viewData,
    };
  }
}
