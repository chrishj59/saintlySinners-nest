import { Test, TestingModule } from '@nestjs/testing';
import { RemoteFilesController } from './remote-files.controller';

describe('RemoteFilesController', () => {
  let controller: RemoteFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemoteFilesController],
    }).compile();

    controller = module.get<RemoteFilesController>(RemoteFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
