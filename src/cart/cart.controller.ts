import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';

import { Item } from 'src/models/item.entity';
import { Order } from 'src/models/order.entity';
import { OrdersService } from 'src/models/orders.service';
import { Product } from 'src/models/product.entity';
import { ProductsService } from '../models/products.service';
import { UsersService } from '../models/users.service';

@Controller('/cart')
export class CartController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('/')
  @Render('cart/index')
  async index(@Req() req) {
    let total = 0;
    let productsInCart: Product[] = null;
    const productsInSession = req.session.products;
    if (productsInSession) {
      productsInCart = await this.productsService.findByIds(
        Object.keys(productsInSession),
      );
      total = Product.sumPricesByQuantities(productsInCart, productsInSession);
    }

    let userBalance;
    let formattedUserBalance;
    if (req.session.user) {
      userBalance = (
        await this.usersService.findOneById(+req.session.user.id)
      ).getBalance();
      formattedUserBalance = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(userBalance);
    }

    const viewData = [];
    viewData['title'] = 'Cart - Online Store';
    viewData['subtitle'] = 'Shopping Cart';
    viewData['total'] = total;
    viewData['productsInCart'] = productsInCart;
    viewData['path'] = {
      cart: 'active',
    };
    viewData['balanceInfo'] = {
      show: req.session.user ? true : false,
      balance: formattedUserBalance,
      enough: userBalance > total ? true : false,
    };
    viewData['btnStatus'] = total > userBalance ? 'danger' : 'success';

    return {
      viewData,
    };
  }

  @Post('/add/:id')
  @Redirect('/cart')
  add(@Param('id', ParseIntPipe) id: number, @Body() body, @Req() req) {
    let productsInSession = req.session.products;
    let productsInSessionLength = req.session.productsLength;

    // check if references are defined,
    // if not define
    if (!productsInSession) {
      productsInSession = {};
      productsInSessionLength = 0;
    }
    // create or update the relevant fields
    if (!productsInSession[id]) {
      productsInSession[id] = +body.quantity;
    } else {
      productsInSession[id] += +body.quantity;
    }
    const itemIds = Object.keys(productsInSession);
    productsInSessionLength = itemIds.reduce(
      (acc, cur) => acc + productsInSession[cur],
      0,
    );

    req.session.products = productsInSession;
    req.session.productsLength = productsInSessionLength;
  }

  @Get('/delete')
  @Redirect('/cart')
  deleteAll(@Req() req) {
    req.session.products = null;
  }

  @Post('/set/:id')
  @Redirect('/cart')
  set(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const productsInSession = req.session.products;
    let productsInSessionLength = req.session.productsLength;

    productsInSession[id] = +req.body.quantity;
    const itemIds = Object.keys(productsInSession);
    productsInSessionLength = itemIds.reduce(
      (acc, cur) => acc + productsInSession[cur],
      0,
    );

    req.session.products = productsInSession;
    req.session.productsLength = productsInSessionLength;
  }

  @Get('/delete/:id')
  @Redirect('/cart')
  deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const productsInSession = req.session.products;
    delete productsInSession[id];
    req.session.products = productsInSession;
  }

  @Get('/purchase')
  async purchase(@Req() req, @Res() res) {
    if (!req.session.user) {
      // add a redirect property to the session object,
      // the property will instruct the login route,
      // to redirect the user back to the cart
      req.session.redirect = '/cart';
      return res.redirect('/auth/login');
    } else if (!req.session.products) {
      return res.redirect('/cart');
    } else {
      const user = await this.usersService.findOneById(req.session.user.id);
      const productsInSession = req.session.products;
      const productsInCart: Product[] = await this.productsService.findByIds(
        Object.keys(productsInSession),
      );
      const items: Item[] = [];
      let total = 0;
      for (const product of productsInCart) {
        const quantity = productsInSession[product.id];
        const item = new Item();
        item.setQuantity(quantity);
        item.setPrice(product.getPrice());
        item.setProduct(product);
        items.push(item);
        total += product.getPrice() * quantity;
      }

      // if total > user balance,
      // redirect to cart
      const userBalance = user.getBalance();
      if (total > userBalance) {
        req.session.flashErrors = ['Not enough balance!'];
        return res.redirect('/cart');
      }

      const newOrder = new Order();
      newOrder.setTotal(total);
      newOrder.setItems(items);
      newOrder.setUser(user);
      const order = await this.ordersService.createOrUpdate(newOrder);

      const newBalance = user.getBalance() - total;
      await this.usersService.updateBalance(user.getId(), newBalance);

      req.session.products = null;

      const viewData = [];
      viewData['title'] = 'Purchase Status';
      viewData['orderId'] = order.getId();
      return res.render('cart/purchase', { viewData });
    }
  }
}
