import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Item } from './entity/item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
  private logger = new Logger('items controller');

  @Get()
  async findAll(): Promise<Item[]> {
    this.logger.log('findAll called');
    console.log('findall called');
    return this.itemsService.allItems();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: number) {
    this.logger.log('find called');
    return '<div>item</div>';
    return await this.itemsService.find(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body('item') item: Item): Promise<void> {
    this.itemsService.create(item);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async update(@Body('item') item: Item): Promise<void> {
    this.itemsService.update(item);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    this.itemsService.delete(id);
  }
}
/*
domain=dev-2vubuto6.eu.auth0.com
client id = gYC2btbPkWhFIP3bLrFrbNmrbPbGLMa7
client secrete= RFJQoC0RVvLCiMgjU2nA6WuV-4dOddYE-JuTzjvMjZ1aTHOPOqMlIuXFYqWDbIi2
*/
