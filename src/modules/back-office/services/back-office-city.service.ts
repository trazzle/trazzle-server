import { Injectable } from "@nestjs/common";
import { CreateCityDto } from "src/modules/cities/dto/create-city.dto";
import { UpdateCityDto } from "src/modules/cities/dto/update-city.dto";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeCityService {
  constructor(private prismaService: PrismaService) {}

  create(createCityDto: CreateCityDto) {
    return this.prismaService.city.create({
      data: {
        name: createCityDto.name,
        countryCode: createCityDto.countryCode,
      },
    });
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return this.prismaService.city.update({
      where: { id },
      data: {
        ...updateCityDto,
      },
    });
  }
}
