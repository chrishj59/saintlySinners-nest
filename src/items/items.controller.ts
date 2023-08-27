import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Item } from './entity/item.entity';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}
  private logger = new Logger('items controller');

  @Get()
  async findAll(): Promise<Item[]> {
    return this.itemsService.allItems();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async find(@Param('id') id: number) {
    return '<div>item</div>';
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
