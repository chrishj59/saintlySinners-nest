import { Test, TestingModule } from '@nestjs/testing';
import { ProductFilesService } from './product-files.service';

describe('ProductFilesService', () => {
  let service: ProductFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFilesService],
    }).compile();

    service = module.get<ProductFilesService>(ProductFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
