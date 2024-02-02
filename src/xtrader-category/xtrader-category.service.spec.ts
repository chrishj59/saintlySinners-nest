import { Test, TestingModule } from '@nestjs/testing';
import { XtraderCategoryService } from './xtrader-category.service';

describe('XtraderCategoryService', () => {
  let service: XtraderCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XtraderCategoryService],
    }).compile();

    service = module.get<XtraderCategoryService>(XtraderCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
