import { Module, Global } from '@nestjs/common';

import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { DatabaseModule } from './database.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { AccountModule } from './account/account.module';

@Global()
@Module({
  imports: [DatabaseModule, AdminModule, AuthModule, CartModule, AccountModule],
  controllers: [AppController, ProductsController],
})
export class AppModule {}
