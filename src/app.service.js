import { Injectable } from '@nestjs/common';
import { Magic } from '@magic-sdk/admin';

const magic = new Magic(process.env.MAGIC_API_SK);

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }

  /**
   * Checks if a user matches known users (can be swapped with database calls or some other list)
   * @param {string} user
   * @returns true or false
   */
  isValidUser(user) {
    return user === 'chrisaxle14@gmail.com' ? true : false;
  }

  /**
   * Validates token against what is stored in magic app
   * @param {string} didToken
   * @returns true if token matches otherwise false
   */
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
