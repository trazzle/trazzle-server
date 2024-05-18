import { Test, TestingModule } from "@nestjs/testing";
import { MagnetsController } from "./magnets.controller";
import { MagnetsService } from "../service/magnets.service";
import { mockMagnetsService } from "test/mock/mock-services";

describe("MagnetsController", () => {
  let controller: MagnetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MagnetsController],
      providers: [
        {
          provide: MagnetsService,
          useValue: mockMagnetsService,
        },
      ],
    }).compile();

    controller = module.get<MagnetsController>(MagnetsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
