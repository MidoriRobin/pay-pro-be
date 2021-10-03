import { Injectable } from '@nestjs/common';
import { Magic } from '@magic-sdk/admin';
import Stripe from 'stripe';

const magic = new Magic(process.env.MAGIC_API_SK);

// TODO: investigate why the api key isnt being picked up
// ? https://docs.nestjs.com/techniques/configuration
// ! stripe key not being read from env variables

const stripe = new Stripe(`${process.env.STRIPE_KEY}`);

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
      console.warn('Error while trying to validate magic token');
    }

    return isValid;
  }

  /**
   * Creates a payment session with stripe
   * @param {obj} itemInfo
   * @returns
   */
  async handleStripeSession(itemInfo) {
    let cost = 0;

    if (!itemInfo) {
      cost = 100;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: 'usd',
    });

    return { clientSecret: paymentIntent.client_secret };

    // return { clientSecret: 'some-secret' };
  }

  async checkoutSession(itemInfo) {
    const session = await stripe.checkout.session.create({
      line_items: [
        {
          price: 100,
          quantity: 1,
        },
      ],
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
    });

    return session;
  }
}
