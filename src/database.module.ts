import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsService } from './models/products.service';
import { Product } from './models/product.entity';
import { User } from './models/user.entity';
import { UsersService } from './models/users.service';
import { Order } from './models/order.entity';
import { OrdersService } from './models/orders.service';

const synchronize = process.env.NODE_ENV !== 'production';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product, User, Order]),
  ],
  providers: [ProductsService, UsersService, OrdersService],
  exports: [ProductsService, UsersService, OrdersService],
})
export class DatabaseModule {}
