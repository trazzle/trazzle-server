import { execSync } from "child_process";
import { path } from "app-root-path";

module.exports = async () => {
  execSync(`docker-compose -f ${path}/${globalThis.dockerComposeFileName} down`);
  console.log(`Test is finished and test environment is teared down.`);
};
