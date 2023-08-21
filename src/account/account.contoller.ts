import { Controller, Get, Render, Req, Res } from '@nestjs/common';

import { OrdersService } from 'src/models/orders.service';

@Controller('/account')
export class AccountController {
  constructor(private ordersService: OrdersService) {}

  @Get('/orders')
  @Render('account/orders')
  async orders(@Req() req, @Res() res) {
    // if user is not logged in redirect default page
    if (!req.session.user) return res.redirect('/');

    const viewData = [];
    viewData['title'] = 'My Orders - Online Store';
    viewData['subtitle'] = 'My Orders';
    viewData['orders'] = await this.ordersService.findByUserId(
      +req.session.user.id,
    );
    viewData['path'] = {
      orders: 'active',
    };

    return {
      viewData,
    };
  }
}
