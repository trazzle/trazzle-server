// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import addCity from "./functions/add-city.seed";
import addCountry from "./functions/add-country.seed";

const prisma = new PrismaClient();

async function main() {
  await addCountry(prisma);
  await addCity(prisma);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
