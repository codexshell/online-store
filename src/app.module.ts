import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { DatabaseModule } from './database.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [DatabaseModule, AdminModule],
  controllers: [AppController, ProductsController],
  providers: [],
})
export class AppModule {}
