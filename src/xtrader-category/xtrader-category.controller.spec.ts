import { Test, TestingModule } from '@nestjs/testing';
import { XtraderCategoryController } from './xtrader-category.controller';

describe('XtraderCategoryController', () => {
  let controller: XtraderCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XtraderCategoryController],
    }).compile();

    controller = module.get<XtraderCategoryController>(XtraderCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
