import { Test, TestingModule } from '@nestjs/testing';
import { XtraderController } from './xtrader.controller';

describe('XtraderController', () => {
  let controller: XtraderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [XtraderController],
    }).compile();

    controller = module.get<XtraderController>(XtraderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
