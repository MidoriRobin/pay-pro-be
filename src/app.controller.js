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
// TODO: Add documentation

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

  @Post('sign-up')
  @Bind(Body(), Res(), Req())
  async signUp(body, response, request) {
    const didToken = request.headers.authorization.substr(7);

    return this.appService.validateMagicToken(didToken)
      ? response.status(201).json({ authenticated: true })
      : response.status(400).json({
          message: 'There was an issue trying to complete your request',
        });
  }

  @Post('create-pay-intent')
  @Bind(Body(), Res(), Req())
  async payForService(body, response, request) {
    // console.log('Creating a stripe payment intent');

    let statusCode = 200;
    let secret = {};

    // CHeck for user validity

    // Send client secret
    try {
      secret = await this.appService.handleStripeSession(100);
    } catch (error) {
      console.warn(error.raw.message);
      statusCode = 500;
    }

    return statusCode === 200
      ? response.status(statusCode).send(secret)
      : response.status(statusCode);
  }

  //? Unused can be used for abstracting payment details to stripe
  @Post('checkout')
  @Bind(Body(), Res(), Req())
  async checkoutForService(body, response, request) {
    const checkoutResult = await this.appService.checkoutSession('itemInfo');

    return response.redirect(303, checkoutResult.url);
  }
}
