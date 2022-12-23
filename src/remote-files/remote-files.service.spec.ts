import { Test, TestingModule } from '@nestjs/testing';
import { RemoteFilesService } from './remote-files.service';

describe('RemoteFilesService', () => {
  let service: RemoteFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RemoteFilesService],
    }).compile();

    service = module.get<RemoteFilesService>(RemoteFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
