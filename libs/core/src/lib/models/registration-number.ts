/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class RegistrationNumber {
  private _value: number = null;
  private _isGcc = false;
  constructor(regNo?: number) {
    if (regNo) {
      this.value = regNo;
    }
  }
  get value(): number {
    return this._value;
  }
  set value(value: number) {
    this._value = value;
  }

  set isGcc(isGcc: boolean) {
    this._isGcc = isGcc;
  }

  get isGcc(): boolean {
    return this._isGcc;
  }
}
