import { Controller, Get, Res } from "@nestjs/common";
import { CustomConfigService } from "../core/config/custom-config.service";
import { AwsS3Service } from "../core/aws-s3/aws-s3.service";
import { TERMS_OF_PERSONAL_INFORMATION, TERMS_OF_SERVICE } from "src/commons/constants/trazzle-service-terms.constant";
import { HttpService } from "@nestjs/axios";
import { Response } from "express";

@Controller()
export class TermsController {
  constructor(
    private readonly customConfigService: CustomConfigService,
    private readonly awsS3Service: AwsS3Service,
    private readonly httpService: HttpService,
  ) {}

  @Get("personal-info")
  async getTermsOfPersonalInfo(@Res() res: Response) {
    const data = await this.awsS3Service.getFileFromS3Bucket({ Key: TERMS_OF_PERSONAL_INFORMATION });
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline;`,
    });

    res.send(data);
  }

  @Get("service")
  async getTermsOfService(@Res() res: Response) {
    const data = await this.awsS3Service.getFileFromS3Bucket({ Key: TERMS_OF_SERVICE });
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline;`,
    });

    res.send(data);
  }
}
