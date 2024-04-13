import { Injectable } from "@nestjs/common";
import { CustomConfigService } from "../config/custom-config.service";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { deleteObjectCommandDto, getObjectCommandDto, putObjectCommandDto } from "./dtos/s3-command.dto";
import ENV_KEY from "../config/constants/env-config.constant";
import { Readable } from "stream";

@Injectable()
export class AwsS3Service {
  private readonly s3Client;
  private readonly AWS_REGION;
  private readonly AWS_S3_BUCKET_NAME;
  private readonly NODE_MODE;
  private readonly AWS_HOST;

  constructor(private customConfigService: CustomConfigService) {
    this.NODE_MODE = this.customConfigService.get(ENV_KEY.NODE_ENV) ?? "development";
    this.AWS_REGION = this.customConfigService.get(ENV_KEY.AWS_REGION);
    this.AWS_S3_BUCKET_NAME = this.customConfigService.get(ENV_KEY.AWS_S3_BUCKET_NAME);
    this.AWS_HOST = `https://${this.AWS_S3_BUCKET_NAME}.s3.${this.AWS_REGION}.amazonaws.com`;

    this.s3Client = new S3Client({
      region: this.AWS_REGION,
      credentials: {
        accessKeyId: this.customConfigService.get(ENV_KEY.AWS_ACCESS_KEY),
        secretAccessKey: this.customConfigService.get(ENV_KEY.AWS_SECRET_ACCESS_KEY),
      },
    });
  }

  publishS3URL(Key: string) {
    /**
     * 1) 이미지 프로필 변경
     * Key: profiles/{user-id}/{new-profile-image-file-name}
     */
    const url = `https://${this.AWS_S3_BUCKET_NAME}.s3.${this.AWS_REGION}.amazonaws.com/${this.NODE_MODE}/${Key}`;
    return url;
  }

  async uploadImageToS3Bucket(dto: putObjectCommandDto) {
    const Key = `${this.NODE_MODE}/${dto.Key}`;

    // 이미지 1개 업로드
    const putObjectCommand = new PutObjectCommand({
      Bucket: this.AWS_S3_BUCKET_NAME,
      Key: Key,
      Body: dto.Body,
      ContentType: dto.ContentType,
    });

    await this.s3Client.send(putObjectCommand);
    return {
      Key: Key,
      url: `${this.AWS_HOST}/${Key}`,
    };
  }

  async getFileFromS3Bucket(dto: getObjectCommandDto) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.AWS_S3_BUCKET_NAME,
      Key: `${this.NODE_MODE}/${dto.Key}`,
    });

    const readable = (await this.s3Client.send(getObjectCommand)).Body as Readable;
    const chunks: Buffer[] = [];
    for await (const chunk of readable) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  async deleteImageFromS3Bucket(dto: deleteObjectCommandDto) {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: this.AWS_S3_BUCKET_NAME,
      ...dto,
    });

    await this.s3Client.send(deleteObjectCommand);
  }

  async delete(url: string) {
    const Key = url.replace(this.AWS_HOST + "/", "");
    await this.deleteImageFromS3Bucket({ Key });
  }
}
