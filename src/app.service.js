import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }

  isValidUser(user) {
    return user === "chrisaxle14@gmail.com" ? true : false;
  }
}
