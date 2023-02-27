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

  public async find(id: number): Promise<Item> {
    return await this.itemRepository.findOne({ where: { id } });
  }

  public async update(updatedItem: Item) {
    const { affected } = await this.itemRepository.update(
      { id: updatedItem.id },
      updatedItem,
    );

    if (!affected || affected === 0) {
      throw new Error('No record found to update');
    }
  }

  public async delete(id: number) {
    const { affected } = await this.itemRepository.delete({ id: id });

    if (affected) {
      return;
    }

    throw new Error('No record found to delete');
  }
}
