/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from '../services';

/**
 * This is the base component for all the smart and dumb component.
 *
 * @export
 * @abstract
 * @class BaseComponent
 * @implements {OnDestroy}
 */
@Directive()
export abstract class BaseComponent implements OnDestroy {
  public destroy$: Subject<boolean> = new Subject();

  /**
   *
   * This method is to perform cleanup activities when an instance of component is destroyed.
   * @memberof BaseComponent
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  showErrorMessageAPI = function (err: HttpErrorResponse, alertService: AlertService) {
    if (err.error.details && err.error.details.length > 0) {
      alertService.showError(null, err.error.details);
    } else {
      alertService.showError(err.error.message);
    }
  };
}
