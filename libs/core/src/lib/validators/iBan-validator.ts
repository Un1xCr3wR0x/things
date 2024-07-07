/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { AbstractControl } from '@angular/forms';

/**
 * This method is to validate the Iqama
 * @param control
 */
export function iBanValidator(control: AbstractControl): { [key: string]: object } | null {
  let valid = true;
  if (control && control.value) {
    let iBan = control.value.toString();

    const letter = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z'
    ];
    const digits = [
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
      '28',
      '29',
      '30',
      '31',
      '32',
      '33',
      '34',
      '35'
    ];

    if (!new RegExp('^([S]{1})([A]{1})(?!00)(?!01)(?!99)([0-9]{2})([0-9]{2})([A-Za-z0-9]{18})$').test(iBan)) {
      valid = false;
    }
    iBan.toUpperCase();
    iBan = iBan.substring(4, 24) + iBan.substring(0, 4);
    for (let i = 0; i <= 25; i++) {
      iBan = iBan.replace(new RegExp(letter[i], 'g'), digits[i]);
    }
    const coss = Math.ceil(Number(iBan.length / 7));
    let rmndr = '';
    let startIndex = 0;
    let endIndex = 0;
    for (let i = 1; i <= coss; i++) {
      startIndex = (i - 1) * 7;
      endIndex = startIndex + 7;
      if (endIndex > iBan.length) {
        endIndex = iBan.length;
      }
      rmndr = '' + (Number(rmndr + iBan.substring(startIndex, endIndex)) % 97);
    }
    // Remainder must be 1
    if (rmndr !== '1') {
      valid = false;
    }
  }
  return valid ? null : { invalidIBan: { valid: false, value: null } };
}
