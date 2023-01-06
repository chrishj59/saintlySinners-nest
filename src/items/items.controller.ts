import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Item } from './entity/item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.allItems();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body('item') item: Item): Promise<void> {
    this.itemsService.create(item);
  }
}

/*
domain=dev-2vubuto6.eu.auth0.com
client id = gYC2btbPkWhFIP3bLrFrbNmrbPbGLMa7
client secrete= RFJQoC0RVvLCiMgjU2nA6WuV-4dOddYE-JuTzjvMjZ1aTHOPOqMlIuXFYqWDbIi2
*/
