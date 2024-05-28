import { path } from "app-root-path";
import { join } from "path";
import { readFileSync } from "fs";
import YAML from "yaml";

describe("OpenAPI", () => {
  it("load", () => {
    join(path, "openapi", "openapi.yaml.bak");
    const read = readFileSync(join(path, "openapi", "openapi.yaml.bak"), "utf8");
    const obj = YAML.parse(read);
    console.log(obj);
  });
});
