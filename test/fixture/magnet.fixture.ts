import * as Supertest from "supertest";
import { createReadStream } from "fs";
import { resolve } from "path";
import { path } from "app-root-path";
import { INestApplication } from "@nestjs/common";

export const 마그넷_생성 = async (app: INestApplication, accessToken: string, cityId?: number, image?: string) => {
  const request = Supertest.agent(app.getHttpServer())
    .post("/api/back-office/magnets")
    .set("Authorization", `Bearer ${accessToken}`)
    .set("Content-Type", "multipart/form-data")
    .field("cityId", cityId);
  if (image) {
    request.attach("image", createReadStream(resolve(path, "test", "data", image)));
  }
  return request;
};
