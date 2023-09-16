import { Response } from 'express';

type Options = {
  expires?: Date;
  httpOnly?: boolean;
};
type Settings = {
  secret: string;
  value: string;
  options?: Options;
};
/**
 * For setting a cookie token
 *
 * @param res
 * @param settings
 */

const CookeToken = async (res: Response, settings: Settings) => {
  new Promise((resolve, reject) => {
    const { secret, value } = settings;
    const days = 3;
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const options = {
      expires,
      httpOnly: true,
      ...settings?.options,
    };

    const cookie = res.cookie(secret, value, options);
    resolve(cookie);
    reject(new Error('Error setting cookie'));
  });
};

export default CookeToken;
