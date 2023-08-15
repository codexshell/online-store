import { Module, Global } from '@nestjs/common';

import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { DatabaseModule } from './database.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Global()
@Module({
  imports: [DatabaseModule, AdminModule, AuthModule],
  controllers: [AppController, ProductsController],
})
export class AppModule {}
