/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ContributorRouteConstants } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ContributorRoutingService {
  /** Local variables. */
  private _currentUrl: string;
  private _previousUrl: string;

  /** Getters. */
  public get currentUrl(): string {
    return this._currentUrl;
  }
  public get previousUrl(): string {
    return this._previousUrl;
  }

  /** Setters. */
  public set currentUrl(url: string) {
    this._currentUrl = url;
  }
  public set previousUrl(url: string) {
    this._previousUrl = url;
  }

  constructor(private router: Router) {
    this._currentUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._previousUrl = this._currentUrl;
        this._currentUrl = event.url;
      }
    });
  }

  /** Method to navigate to add contributor. */
  routeToAddContributor() {
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_CONTRIBUTOR]);
  }

  /** Method to navigate to add seconded. */
  routeToAddSeconded() {
    this.router.navigate([ContributorRouteConstants.ROUTE_ADD_SECONDED]);
  }
}
