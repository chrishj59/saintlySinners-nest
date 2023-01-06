import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ItemDto } from './dtos/item.dto';
import { Item } from './entity/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}
  public async allItems(): Promise<Item[]> {
    return await this.itemRepository.find();
  }

  public async create(itemDto: ItemDto): Promise<Item> {
    const item = new Item();
    item.name = itemDto.name;
    item.price = itemDto.price;
    item.description = itemDto.description;
    item.image = itemDto.image;
    const newItem = await this.itemRepository.save(Item, { reload: true });
    return newItem;
  }
}
