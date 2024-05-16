import { Test, TestingModule } from "@nestjs/testing";
import { CountriesController } from "./countries.controller";
import { CountriesService } from "../service/countries.service";
import { mockCountriesService } from "test/mock/mock-services";

describe("CountriesController", () => {
  let controller: CountriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [{
        provide: CountriesService,
        useValue: mockCountriesService,
      }],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
