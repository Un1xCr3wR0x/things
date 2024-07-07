/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterConstants, RouterData, RouterDataToken } from '@gosi-ui/core';
import { UiRoutingService } from './ui-routing.service';

describe('UiRoutingService', () => {
  let service: UiRoutingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: RouterDataToken, useClass: RouterData }]
    });
    service = TestBed.inject(UiRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('navigate to inbox', () => {
    spyOn(service.router, 'navigate');
    service.navigateToInbox();
    service.router.navigate([RouterConstants.ROUTE_INBOX]);
    expect(service.router.navigate).toHaveBeenCalledWith(['/home/transactions/list/worklist']);
  });
});
