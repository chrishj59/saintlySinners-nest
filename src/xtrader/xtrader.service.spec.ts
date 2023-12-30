import { Test, TestingModule } from '@nestjs/testing';
import { XtraderService } from './xtrader.service';

describe('XtraderService', () => {
  let service: XtraderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [XtraderService],
    }).compile();

    service = module.get<XtraderService>(XtraderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
