import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './models/products.service';
import { Product } from './models/product.entity';
import { User } from './models/user.entity';
import { UsersService } from './models/users.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'online_store',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, User]),
  ],
  providers: [ProductsService, UsersService],
  exports: [ProductsService, UsersService],
})
export class DatabaseModule {}
