import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { UpdateUserRequestBodyDto } from "../dtos/req/update-user-request-body.dto";
import { SignInUser } from "src/decorators/sign-in-user.decorator";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { AuthService } from "src/modules/core/auth/services/auth.service";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  SignInOrSignUpAppleRequestBodyDto,
  SignInOrSignUpGoogleRequestBodyDto,
  SignInOrSignUpKakaoRequestBodyDto,
} from "../dtos/req/sign-in-sign-up-request-body.dto";
import { AuthHelper } from "src/modules/core/auth/helpers/auth.helper";
import { UpdateAccessTokenRequestDto } from "../dtos/req/update-access-token-request.dto";
import {
  LoginSucceedUserResponseDto,
  LoginSucceedUserWithTokenResponseDto,
} from "../dtos/res/login-succeed-user-response.dto";
import { AwsS3Service } from "src/modules/core/aws-s3/aws-s3.service";
import { GetOneUserResponseDto } from "src/modules/users/dtos/res/get-one-user-response.dto";
import { UpdateUserResponseDto } from "src/modules/users/dtos/res/update-user-response.dto";
import { UpdateAccessTokenResponseDto } from "src/modules/users/dtos/res/update-access-token-response.dto";

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authHelperService: AuthHelper,
    private readonly authService: AuthService,
    private readonly awsS3Service: AwsS3Service,
  ) {}

  // 로그인한 회원정보 조회
  @UseGuards(JwtAuthGuard)
  @Get()
  async myProfile(
    @SignInUser() user: LoginSucceedUserResponseDto, // login required
  ): Promise<GetOneUserResponseDto> {
    const result = await this.usersService.getOneUser(user.user_id);
    return {
      name: result.name,
      intro: result.intro,
      profile_image: result.profileImageURL,
    };
  }

  // 회원탈퇴
  @UseGuards(JwtAuthGuard)
  @Delete()
  async withdrawUser(@SignInUser() user: LoginSucceedUserResponseDto) {
    // 탈퇴처리된 유저는 DB에 해당 데이터로우 삭제
    return await this.usersService.deleteUser(user.user_id);
  }

  // 로그아웃
  @UseGuards(JwtAuthGuard)
  @Get("sign-out")
  async signOut(@SignInUser() user: LoginSucceedUserResponseDto) {
    return await this.authService.signOut(user.user_id);
  }

  // 소셜로그인
  @Post("sign-in/kakao")
  async signInKakao(@Body() body: SignInOrSignUpKakaoRequestBodyDto): Promise<LoginSucceedUserWithTokenResponseDto> {
    const user = await this.authHelperService.signingWithSocial(body);
    return {
      user_id: user.id,
      name: user.name,
      profile_image: user.profileImageURL,
      intro: user.intro,
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    };
  }

  @Post("sign-in/apple")
  async signInApple(@Body() body: SignInOrSignUpAppleRequestBodyDto): Promise<LoginSucceedUserWithTokenResponseDto> {
    const user = await this.authHelperService.signingWithSocial(body);
    return {
      user_id: user.id,
      name: user.name,
      profile_image: user.profileImageURL,
      intro: user.intro,
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    };
  }

  @Post("sign-in/google")
  async signInGoogle(@Body() body: SignInOrSignUpGoogleRequestBodyDto): Promise<LoginSucceedUserWithTokenResponseDto> {
    const user = await this.authHelperService.signingWithSocial(body);
    return {
      user_id: user.id,
      name: user.name,
      profile_image: user.profileImageURL,
      intro: user.intro,
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    };
  }

  @Post("sign-in/account")
  async signInAccount(@Query("account") account: string): Promise<LoginSucceedUserWithTokenResponseDto> {
    const user = await this.authService.signInAccount(account);
    return {
      user_id: user.id,
      name: user.name,
      profile_image: user.profileImageURL,
      intro: user.intro,
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    };
  }

  // 회원정보 수정 - TBD : name / intro / profile 수정
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @Patch("profile")
  async updateUser(
    @SignInUser() user: LoginSucceedUserResponseDto,
    @Body() body: UpdateUserRequestBodyDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UpdateUserResponseDto> {
    const { name, intro } = body;
    // if (!file) {
    //   // 수정이전 유저프로필 이미지
    //   if (user.profile_image) {
    //     await this.awsS3Service.getFileFromS3Bucket({ Key: `profiles/${user.profile_image}` });
    //   }
    // }
    const result = await this.usersService.updateUser({
      id: user.user_id,
      name: name ?? user.name,
      intro: intro ?? user.intro,
      profileImageFile: file ?? null,
    });

    return {
      name: result.name,
      intro: result.intro,
      profile_image: result.profileImageURL,
    };
  }

  @Patch("token")
  async updateAccessToken(@Body() body: UpdateAccessTokenRequestDto): Promise<UpdateAccessTokenResponseDto> {
    const { refreshToken, userId, account } = body;

    // 리프래시토큰을 활용하여 액세스토큰을 갱신한다.
    const updatedNewAccessToken = await this.authService.updateAccessToken({
      refreshToken: refreshToken,
      userId: userId,
      account: account,
    });

    return {
      access_token: updatedNewAccessToken,
    };
  }
}
