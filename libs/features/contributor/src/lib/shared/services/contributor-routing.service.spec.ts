/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ContributorRouteConstants } from '../constants';
import { ContributorRoutingService } from './contributor-routing.service';

const routerSpy = {
  navigate: jasmine.createSpy('navigate'),
  url: jasmine.createSpy('url'),
  events: new Observable(event => event.next(new NavigationEnd(12, '/home', '/home')))
};

describe('RouterService', () => {
  let service: ContributorRoutingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerSpy }]
    });
    service = TestBed.inject(ContributorRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to add contributor', () => {
    service.routeToAddContributor();
    expect(service['router'].navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_ADD_CONTRIBUTOR]);
  });
  it('should navigate to seconded', () => {
    service.routeToAddSeconded();
    expect(service['router'].navigate).toHaveBeenCalledWith([ContributorRouteConstants.ROUTE_ADD_SECONDED]);
  });
});
