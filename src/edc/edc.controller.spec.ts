import { Test, TestingModule } from '@nestjs/testing';
import { EdcController } from './edc.controller';

describe('EdcController', () => {
  let controller: EdcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdcController],
    }).compile();

    controller = module.get<EdcController>(EdcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
