import { Test, TestingModule } from '@nestjs/testing';
import { EdcService } from './edc.service';

describe('EdcService', () => {
  let service: EdcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdcService],
    }).compile();

    service = module.get<EdcService>(EdcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
