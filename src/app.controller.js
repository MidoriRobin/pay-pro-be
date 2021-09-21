import { Controller, Dependencies, Get, Post, Body, Bind, Res } from '@nestjs/common';
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

  @Post("login")
  @Bind(Body(), Res())
  async loginUser(body, response) {
    console.log(`The item recieved is: ${JSON.stringify(body)}`);
    return this.appService.isValidUser(body.email) ? response.status(200).send() : response.status(202).send();
  }
}
