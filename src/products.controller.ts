import {
  Controller,
  Get,
  Render,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { ProductService } from './models/product.service';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @Render('products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Products - Online Store';
    viewData['subtitle'] = 'List of products';
    viewData['products'] = await this.productService.findAll();
    return {
      viewData,
    };
  }

  @Get('/:id')
  async show(@Param('id', ParseIntPipe) id: number, @Res() response) {
    const product = await this.productService.findOne(id);
    if (!product) return response.redirect('/products');

    const viewData = [];
    viewData['title'] = product.getName() + ' - Online Store';
    viewData['subtitle'] = product.getName() + ' - Product Information';
    viewData['product'] = product;

    return response.render('products/show', { viewData });
  }
}
