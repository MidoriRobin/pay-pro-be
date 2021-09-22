import {
  Controller,
  Dependencies,
  Get,
  Post,
  Body,
  Bind,
  Res,
  Req,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
@Dependencies(AppService)
export class AppController {
  constructor(appService) {
    this.appService = appService;
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Post('check')
  @Bind(Body(), Res(), Req())
  checkUserEmail(body, response, request) {
    return this.appService.isValidUser(body.email)
      ? response.status(200).json({ valid: true })
      : response.status(200).json({ valid: false });
  }

  @Post('login')
  @Bind(Body(), Res(), Req())
  async loginUser(body, response, request) {
    const didToken = request.headers.authorization.substr(7);

    return this.appService.validateMagicToken(didToken) &&
      this.appService.isValidUser(body.email)
      ? response.status(200).json({ authenticated: true })
      : response
          .status(202)
          .json({ message: 'no user exists, error with magic validation' });
  }
}
