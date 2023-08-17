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
} from '@nestjs/common';

import { ProductsService } from '../models/products.service';
import { Product } from 'src/models/product.entity';

@Controller('/cart')
export class CartController {
  constructor(private readonly productsService: ProductsService) {}

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

    const viewData = [];
    viewData['title'] = 'Cart - Online Store';
    viewData['subtitle'] = 'Shopping Cart';
    viewData['total'] = total;
    viewData['productsInCart'] = productsInCart;
    viewData['path'] = {
      cart: 'active',
    };

    return {
      viewData,
    };
  }

  @Post('/add/:id')
  @Redirect('/cart')
  add(@Param('id', ParseIntPipe) id: number, @Body() body, @Req() req) {
    let productsInSession = req.session.products;
    // check if productsInSession reference is defined,
    // if not define it,
    if (!productsInSession) {
      productsInSession = {};
    }
    // create or update the relevant field
    if (!productsInSession[id]) {
      productsInSession[id] = +body.quantity;
    } else {
      productsInSession[id] += +body.quantity;
    }
    req.session.products = productsInSession;
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
    productsInSession[id] = +req.body.quantity;
    req.session.products = productsInSession;
  }

  @Get('/delete/:id')
  @Redirect('/cart')
  deleteOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const productsInSession = req.session.products;
    delete productsInSession[id];
    req.session.products = productsInSession;
  }
}
