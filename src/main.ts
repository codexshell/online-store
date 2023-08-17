import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import * as session from 'express-session';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, '..', 'views/layouts'));
  if (hbsUtils.registerWatchedPartials) {
    hbsUtils.registerWatchedPartials(join(__dirname, '..', 'views/layouts'));
  }

  app.use(
    session({
      secret: 'nest-book',
      resave: false,
      saveUninitialized: false,
    }),
  );
  // middleware used to enable access to the session values from the hbs views
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    if (req.session.flashErrors) {
      res.locals.flashErrors = req.session.flashErrors;
      req.session.flashErrors = null;
    }
    next();
  });
  // middleware for protecting the /admin* routes
  app.use('/admin*', function (req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      res.redirect('/');
    }
  });

  await app.listen(3000);
}
bootstrap();
