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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Product } from 'src/models/product.entity';
import { ProductsService } from 'src/models/products.service';
import { ProductValidator } from 'src/validators/product.validator';
import * as fs from 'fs';

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

  @Post('/store')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  @Redirect('/admin/products')
  async store(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const toValidate: string[] = [
      'name',
      'description',
      'price',
      'imageCreate',
    ];
    const errors: string[] = ProductValidator.validate(body, file, toValidate);
    if (errors.length > 0) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      req.session.flashErrors = errors;
    } else {
      const newProduct = new Product();
      newProduct.setName(body.name);
      newProduct.setDescription(body.description);
      newProduct.setPrice(body.price);
      newProduct.setImage(file.filename);
      await this.productsService.createOrUpdate(newProduct);
    }
  }

  @Post('/:id')
  @Redirect('/admin/products')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Get('/:id')
  @Render('admin/products/edit')
  async edit(@Param('id', ParseIntPipe) id: number) {
    const viewData = [];
    viewData['title'] = 'Admin Page - Edit Product - Online Store';
    viewData['product'] = await this.productsService.findOne(id);
    return {
      viewData,
    };
  }

  @Post('/:id/update')
  @UseInterceptors(FileInterceptor('image', { dest: './public/uploads' }))
  async update(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    const product = await this.productsService.findOne(id);

    const toValidate: string[] = [
      'name',
      'price',
      'description',
      'imageUpdate',
    ];
    const errors: string[] = ProductValidator.validate(body, file, toValidate);

    if (errors.length > 0) {
      if (file) {
        fs.unlinkSync(file.path);
      }
      req.session.flashErrors = errors;
      res.redirect(`/admin/products/${product.getId()}`);
    } else {
      product.setName(body.name);
      product.setDescription(body.description);
      product.setPrice(body.price);
      if (file) {
        product.setImage(file.filename);
      }
      await this.productsService.createOrUpdate(product);
      return res.redirect('/admin/products');
    }
  }
}
