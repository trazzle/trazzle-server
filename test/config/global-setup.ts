import { execSync } from "child_process";
import { config } from "dotenv";
import { path } from "app-root-path";

module.exports = async () => {
  const envFileName = ".env.test";
  const dockerComposeFileName = "docker-compose.test.yml";
  const retryDelaySecond = 1;
  const prismaSynchronizeRetryCount = 10;
  globalThis.dockerComposeFileName = dockerComposeFileName;

  // .env.test 파일로부터 설정값 불러오기
  config({ path: `${path}/${envFileName}` });

  execSync(`docker-compose -f ${path}/${dockerComposeFileName} up -d`);
  console.log(`Docker Container for e2e-test is initialized. Try to synchronize schema after 5 seconds.`);
  await new Promise(resolve => setTimeout(resolve, 1000 * 5));

  // Prisma 마이그레이션 실행
  let synchronized = false;
  for (let retryCount = 0; retryCount < prismaSynchronizeRetryCount; retryCount++) {
    try {
      execSync("npx prisma db push");
      console.log(`Prisma schema synchronized.`);
      synchronized = true;
      break;
    } catch (e) {
      console.log(`Prisma schema synchronize retry after ${retryDelaySecond} seconds.`);
      await new Promise(resolve => setTimeout(resolve, 1000 * retryDelaySecond));
    }
  }

  if (!synchronized) {
    execSync(`docker-compose -f ${path}/${dockerComposeFileName} down`);
    throw new Error("Prisma schema synchronize fail.");
  }

  console.log(`----------------------------------------------------------------------`);
  console.log(`Test environment setup is completed.`);
};
