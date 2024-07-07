/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
/**
 * The service class to encry.
 *
 * @export
 * @class CryptoService
 */
@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private passKey = 'GOSIAMEENGOSIAME';

  /**
   * Creates an instance of AuthTokenService.
   */
  constructor() {}

  /**
   * Method to encrypt the token
   * @param value
   */
  encrypt(token): string {
    if (token) {
      let ciphertext = CryptoJS.AES.encrypt(token.toString(), this.passKey).toString();
      ciphertext = ciphertext.toString().replace(/\+/g, 'xMl3Jk').replace(/\//g, 'Por21Ld').replace(/\=/g, 'Ml32');
      return ciphertext;
    }
    return null;
  }

  /**
   * Method to decrypt the token
   */
  decrypt(token): string {
    if (token) {
      token = token
        .toString()
        .replace(/xMl3Jk/g, '+')
        .replace(/Por21Ld/g, '/')
        .replace(/Ml32/g, '=');
      const dataString = CryptoJS.AES.decrypt(token, this.passKey).toString();
      return dataString;
    }
    return null;
  }
}
