import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Render('index')
  index() {
    return {
      title: 'Home Page - Online Store',
    };
  }

  @Get('/about')
  @Render('about')
  about() {
    const viewData = [];
    viewData['description'] = 'This is an about page...';
    viewData['author'] = 'Developed by: Eric';
    const title = 'About us - Online Store';
    return {
      title,
      subtitle: 'About Us',
      viewData,
    };
  }
}
