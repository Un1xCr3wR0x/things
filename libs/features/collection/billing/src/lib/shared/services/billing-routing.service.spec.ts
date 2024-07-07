/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterConstants, RouterData, RouterDataToken } from '@gosi-ui/core';
import { BillingRoutingService } from './billing-routing.service';
import { BillingConstants } from '../constants/billing-constants';

describe('BillingRoutingService', () => {
  let service: BillingRoutingService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: RouterDataToken, useClass: RouterData }]
    });
    service = TestBed.inject(BillingRoutingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('navigate to inbox', () => {
    spyOn(service.router, 'navigate');
    service.navigateToInbox();
    expect(service.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
  });
  it('navigate to bill history', () => {
    spyOn(service.router, 'navigate');
    service.navigateToBillHistory();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/establishment/bill-history']);
  });
  it('navigate to detailed bill', () => {
    spyOn(service.router, 'navigate');
    service.navigateToDetailedBill();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/establishment/detailed-bill']);
  });

  it('navigate to validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'receive-contribution';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/payment']);
  }));
  it('navigate to validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'penalty-waiver-est';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/penalty-waiver']);
  }));
  it('navigate to validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'spcl-penalty-waiver-est';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/exceptional-est-penalty-waiver']);
  }));
  it('navigate to validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'spcl-penalty-waiver-vic';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/exceptional-vic-penalty-waiver']);
  }));

  it('navigate to validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'maintain-event-date';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/eventdate']);
  }));

  it('navigate to validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'cancel-receipt';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/cancel-receipt']);
  }));

  it('navigate to edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'receive-contribution';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/payment/establishment-payment/edit']);
  }));
  it('navigate to edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'penalty-waiver-est';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/penalty-waiver/edit']);
  }));

  it('navigate to edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'receive-contribution-MOF';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/payment/mof-payment/edit']);
  }));
  it('navigate to establishment page', () => {
    spyOn(service.router, 'navigate');
    service.navigateToReceipt();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/receipt/establishment']);
  });
  it('navigate to edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'cancel-receipt';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/payment/cancel-establishment-payment/edit']);
  }));
  it('navigate to mof detailedBill', () => {
    spyOn(service.router, 'navigate');
    service.navigateToMofDetailedBill('2019-04-01', 177);
    expect(service.router.navigate).toHaveBeenCalledWith(
      [BillingConstants.ROUTE_DETAILED_BILL_MOF],
      Object({ queryParams: Object({ monthSelected: '2019-04-01', billNumber: 177 }) })
    );
  });
  it('navigate to Vic Bill History', () => {
    spyOn(service.router, 'navigate');
    service.navigateToVicBillHistory(14557879);
    expect(service.router.navigate).toHaveBeenCalledWith(
      [BillingConstants.ROUTE_VIC_BILL_HISTORY],
      Object({ queryParams: Object({ sin: 14557879 }) })
    );
  });
  it('navigate to dashboardBill', () => {
    spyOn(service.router, 'navigate');
    service.navigateToDashboardBill('2019-04-01', 177, true, '2019-04-01');
    expect(service.router.navigate).toHaveBeenCalledWith(
      [BillingConstants.ROUTE_VIC_DASHBOARD_BILL],
      Object({
        queryParams: Object({
          monthSelected: '2019-04-01',
          billNumber: 177,
          billStartDate: '2019-04-01'
        })
      })
    );
  });
  it('navigate to dashboardBill', () => {
    spyOn(service.router, 'navigate');
    service.navigateToDashboardBill('2019-04-01', 177, false, '2019-04-01');
    expect(service.router.navigate).toHaveBeenCalledWith(
      [BillingConstants.ROUTE_DASHBOARD_BILL],
      Object({
        queryParams: Object({
          monthSelected: '2019-04-01',
          billNumber: 177,
          isSearch: true,
          billStartDate: '2019-04-01'
        })
      })
    );
  });
  it('navigate to credit transfer validator edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-transfer';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith([
      '/home/billing/credit-transfer/establishment-credit-transfer/edit'
    ]);
  }));
  it('navigate to est credit refund validator edit ', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-refund-est';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith([
      '/home/billing/credit-transfer/establishment-refund-credit-balance/edit'
    ]);
  }));
  it('navigate to vic credit refund  validator edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-refund-vic';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith([
      '/home/billing/credit-transfer/vic-refund-credit-balance/edit'
    ]);
  }));
  it('navigate to contributor refund  validator edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-refund-cont';
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith(['/home/billing/credit-transfer/contributor-refund/edit']);
  }));
  it('navigate to exceptional single vic validator edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_ESTABLISHMENT_PENALTY;
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith([BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC_EDIT]);
  }));
  it('navigate to exceptional single establishment validator edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = RouterConstants.TRANSACTION_EXCEPTIONAL_ESTABLISHMENT_PENALTY;
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith([
      BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT_ONEDIT
    ]);
  }));
  it('navigate to exceptional vic segment validator edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = RouterConstants.TRANSACTION_VIC_EXCEPTIONAL_BULK_PENALTY;
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith([
      BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC_SEGMENT_EDIT
    ]);
  }));
  it('navigate to exceptional est segment validator edit', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = RouterConstants.TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY;
    service.navigateToEdit();
    expect(service.router.navigate).toHaveBeenCalledWith([
      BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT_ONEDIT
    ]);
  }));
  it('navigate to penalty waiver validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'bulk-penalty-waiver-vic';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/exceptional-bulk-penalty-waiver']);
  }));
  it('navigate to credit transfer validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-transfer';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/credit-management']);
  }));
  it('navigate to  est credit refund validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-refund-est';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/credit-refund-transfer-est']);
  }));
  it('navigate to vic credit refund validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-refund-vic';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/credit-refund-transfer-vic']);
  }));
  it('navigate to contributor refund  validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = 'credit-refund-cont';
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/validator/contributor-refund']);
  }));
  it('navigate to Mof Dashboard Bill', () => {
    spyOn(service.router, 'navigate');
    service.navigateToMofDashboardBill();
    expect(service.router.navigate).toHaveBeenCalledWith(['home/billing/establishment/dashboard-mof']);
  });
  it('navigate to public inbox', () => {
    spyOn(service.router, 'navigate');
    service.navigateToPublicInbox();
    expect(service.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_TODOLIST]);
  });
  it('navigate to contributor refund  validator', inject([RouterDataToken], (token: RouterData) => {
    spyOn(service.router, 'navigate');
    token.resourceType = RouterConstants.TRANSACTION_ESTABLISHMENT_EXCEPTIONAL_BULK_PENALTY;
    service.navigateToValidator();
    expect(service.router.navigate).toHaveBeenCalledWith([
      BillingConstants.ROUTE_VALIDATOR_BILLING_EXCEPTIONAL_BULK_PENALTY
    ]);
  }));
});
