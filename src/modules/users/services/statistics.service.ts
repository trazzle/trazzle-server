import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/modules/core/database/prisma/prisma.service";
import { GetUserTravelStatisticResponseDto } from "src/modules/users/dtos/res/get-user-travel-statistics-response.dto";

@Injectable()
export class UserStatisticsService {
  constructor(private readonly prismaService: PrismaService) {}

  getUserTravelStatistics(userId: number): Promise<GetUserTravelStatisticResponseDto> {
    return this.prismaService.$transaction(async transaction => {
      // travel: 사용자가 작성한 여행기록(travel-notes) 개수
      const countOfTravelNotes = await transaction.travelNote.count({
        where: {
          userId: userId,
        },
      });

      // userVisitedCountries: 사용자가 다녀온 국가
      let userVisitedCountries = await transaction.travelNote.findMany({
        where: {
          userId: userId,
        },
        include: {
          city: {
            select: { countryCode: true },
          },
        },
      });

      userVisitedCountries = userVisitedCountries
        .map(c => c.city.countryCode)
        .reduce((acc, cur) => {
          if (!acc.includes(cur)) {
            acc.push(cur);
          }

          return acc;
        }, []);

      // countOfCountries: 사용자가 다녀온 국가 개수
      const countOfCountries = userVisitedCountries.length;

      // 전세계 개수
      const totalOfCountries = await transaction.country.count();

      // world: 여행국가 백분율
      // 사용자가 다녀온 국가개수(countOfCountries) 를 전세계중 몇퍼센트인지 백분율로 나타냄
      const percentageOfWorld = ((countOfCountries / totalOfCountries) * 100).toFixed(2);

      return {
        travel: countOfTravelNotes,
        countries: countOfCountries,
        world: `${percentageOfWorld}%`,
      };
    });
  }
}
