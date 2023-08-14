import { Controller, Get, Render } from '@nestjs/common';

import { ProductsService } from 'src/models/product.service';

@Controller('/admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('/')
  @Render('admin/products/index')
  async index() {
    const viewData = [];
    viewData['title'] = 'Admin Page - Online Store';
    viewData['products'] = await this.productsService.findAll();
    return {
      viewData,
    };
  }
}
