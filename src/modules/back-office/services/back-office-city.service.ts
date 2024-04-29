import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCityDto } from "src/modules/cities/dto/create-city.dto";
import { UpdateCityDto } from "src/modules/cities/dto/update-city.dto";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";

@Injectable()
export class BackOfficeCityService {
  constructor(private prismaService: PrismaService) {}

  create(createCityDto: CreateCityDto) {
    const { name, countryCode } = createCityDto;

    this.prismaService.$transaction(async transaction => {
      const city = await transaction.city.findMany({
        where: {
          OR: [
            { name: { contains: name } },
            {
              countryCode: { contains: countryCode },
            },
          ],
        },
      });

      if (city.length > 0) {
        throw new ConflictException("이미 존재하는 도시 입니다.");
      }

      // 신규 도시 등록
      return await transaction.city.create({
        data: {
          name: createCityDto.name,
          countryCode: createCityDto.countryCode,
        },
      });
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
