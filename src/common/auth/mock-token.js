/* eslint-disable no-param-reassign */
import jsw from 'jsonwebtoken';
import ms from 'ms';

export const MOCK_TOKEN_SECRET = 'TESTING';

/**
 * Generates a faux jwt
 *
 * @param   {Object}    options
 * @param   {string|number|Date}    options.expiresIn
 * @param   {string|number|Date}    options.age
 * @param   {Object}    data
 * @param   {string}    data.uid
 * @param   {number}    data.exp
 * @param   {number}    data.iat
 *
 * @param data.iss
 * @returns {string}
 */
export default function mockToken (
  {
    expiresIn = '10m',
    age = '10m',
  } = {},
  {
    uid = 'a1b2c3d',
    iss = 'http://localhost/',
    exp,
    iat,
    ...other
  } = {}
) {
  if (!exp) {
    if (typeof expiresIn === 'string') {
      exp = Math.floor(Date.now() / 1000) + (ms(expiresIn) / 1000);
    }
    if (typeof expiresIn === 'number') {
      exp = Math.floor(Date.now() / 1000) + expiresIn;
    }
    if (expiresIn instanceof Date) {
      exp = Math.floor(expiresIn.valueOf() / 1000);
    }
  }
  if (!iat) {
    if (typeof age === 'string') {
      iat = Math.floor(Date.now() / 1000) + (ms(age) / 1000);
    }
    if (typeof age === 'number') {
      iat = Math.floor(Date.now() / 1000) + age;
    }
    if (age instanceof Date) {
      iat = Math.floor(age.valueOf() / 1000);
    }
  }
  iat = Math.max(iat, 0); // we cannot have a creation date in the future

  const data = {
    iss,
    iat,
    exp,
    uid,
  };

  return jsw.sign({ ...data, ...other }, MOCK_TOKEN_SECRET);
}
