import SwaggerParser from "@apidevtools/swagger-parser";
import { load } from "js-yaml";
import { readFileSync, writeFileSync } from "fs";
import appRootPath from "app-root-path";
import { join, resolve } from "path";
import { stringify } from "yaml";

process.chdir(resolve(__dirname));

(async () => {
  try {
    const openapiPath = join(appRootPath.path, "openapi", "index.yaml");
    const openapiDocument = load(readFileSync(openapiPath));
    const api = await SwaggerParser.validate(openapiDocument);
    writeFileSync(join(appRootPath.path, "openapi", "openapi.yaml"), stringify(api));
    console.log("build success");
  } catch (err) {
    console.log("----ERROR----");
    console.log(err.details || err);
  }
})();
