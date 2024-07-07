import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ContributorTokenDto {
  private _socialInsuranceNo: number;
  private _nin: number;
  private _hasOtherEngagements: BehaviorSubject<boolean>;
  private _isVic: BehaviorSubject<boolean>;

  constructor(sin?: number, nin?: number) {
    if (sin) this._socialInsuranceNo = sin;
    if (nin) this._nin = nin;
    this._isVic = new BehaviorSubject<boolean>(false);
    this._hasOtherEngagements = new BehaviorSubject<boolean>(false);
  }
  set socialInsuranceNo(sin: number) {
    this._socialInsuranceNo = sin;
    this.setIsVic(false);
    this.setOtherEngagements(true);
  }
  get socialInsuranceNo(): number {
    return this._socialInsuranceNo;
  }
  setIsVic(state: boolean) {
    this._isVic.next(state);
  }
  setOtherEngagements(state: boolean) {
    this._hasOtherEngagements.next(state);
  }
  get hasOtherEngagements(): Observable<boolean> {
    return this._hasOtherEngagements.asObservable();
  }
  get isVic(): Observable<boolean> {
    return this._isVic.asObservable();
  }
  set nin(nin: number) {
    this._nin = nin;
  }
  get nin() {
    return this._nin;
  }
}
