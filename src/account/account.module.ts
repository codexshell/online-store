import { Module } from '@nestjs/common';

import { AccountController } from './account.contoller';

@Module({
  controllers: [AccountController],
})
export class AccountModule {}
