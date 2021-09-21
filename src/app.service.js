import { Injectable } from '@nestjs/common';
import { Magic } from '@magic-sdk/admin';

const magic = new Magic(process.env.MAGIC_API_SK);

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }

  isValidUser(user) {
    return user === 'chrisaxle14@gmail.com' ? true : false;
  }

  async validateMagicToken(didToken) {
    let isValid = false;

    try {
      await magic.token.validate(didToken);
      isValid = true;
    } catch (error) {
      console.log('Error while trying to validate magic token');
    }

    return isValid;
  }
}
