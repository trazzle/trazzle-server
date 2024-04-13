import { Controller, Get, Res } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CustomConfigService } from "../core/config/custom-config.service";
import { AwsS3Service } from "../core/aws-s3/aws-s3.service";
import { TERMS_OF_PERSONAL_INFORMATION, TERMS_OF_SERVICE } from "src/commons/constants/trazzle-service-terms.constant";
import { HttpService } from "@nestjs/axios";
import { Response } from "express";

@ApiTags("이용약관")
@Controller()
export class TermsController {
  constructor(
    private readonly customConfigService: CustomConfigService,
    private readonly awsS3Service: AwsS3Service,
    private readonly httpService: HttpService,
  ) {}

  @ApiOperation({ summary: "개인정보 처리방침 약관 조회" })
  @Get("personal-info")
  async getTermsOfPersonalInfo(@Res() res: Response) {
    const data = await this.awsS3Service.getFileFromS3Bucket({ Key: TERMS_OF_PERSONAL_INFORMATION });
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline;`,
    });

    res.send(data);
  }

  @ApiOperation({ summary: "서비스 이용 약관 조회" })
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
