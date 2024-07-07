import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();
  private querySubject = new ReplaySubject<ParamMap>();
  private paramsSubject = new ReplaySubject<ParamMap>();
  snapshot = {};
  /**
   * Creates an instance of ActivatedRouteStub
   * @param initialParams
   * @memberof  ActivatedRouteStub
   */
  constructor(initialParams?: Params, queryParams?: Params) {
    this.setParamMap(initialParams);
    this.setQueryParams(queryParams);
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();
  readonly params = this.paramsSubject.asObservable();
  readonly queryParamMap = this.querySubject.asObservable();
  readonly queryParams = this.querySubject.asObservable();

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
  /** Set the paramMap observables's next value */
  setQueryParams(params?: Params) {
    this.querySubject.next(convertToParamMap(params));
  }
  /** Set the params observables's next value */
  setParams(params?: Params) {
    this.paramsSubject.next(convertToParamMap(params));
  }
}
