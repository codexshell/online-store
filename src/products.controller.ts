import {
  Controller,
  Get,
  Render,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { ProductsService } from './models/products.service';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Products - Online Store';
    viewData['subtitle'] = 'List of products';
    viewData['products'] = await this.productsService.findAll();
    viewData['path'] = {
      products: 'active',
    };

    return {
      viewData,
    };
  }

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number, @Res() response) {
    const product = await this.productsService.findOne(id);
    if (!product) return response.redirect('/products');

    const viewData = [];
    viewData['title'] = product.getName() + ' - Online Store';
    viewData['subtitle'] = product.getName() + ' - Product Information';
    viewData['product'] = product;

    return response.render('products/show', { viewData });
  }
}
