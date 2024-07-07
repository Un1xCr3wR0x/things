/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { BillDashboardServiceStub, ContributionPaymentServiceStub } from 'testing';
import { of, BehaviorSubject } from 'rxjs';
import { RouterDataToken, RouterData, LanguageToken } from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BillDashboardService, ContributionPaymentService } from '../../../shared/services';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { MofAllocationBreakupScComponent } from '..';
import { ActivatedRoute } from '@angular/router';
import { MofAllocationBreakupFilter } from '../../../shared/models/mof-allocation-breakup-filter';

describe('MofReceiptScComponent', () => {
  let component: MofAllocationBreakupScComponent;
  let fixture: ComponentFixture<MofAllocationBreakupScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [MofAllocationBreakupScComponent],
      providers: [
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        { provide: BillDashboardService, useClass: BillDashboardServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MofAllocationBreakupScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise for mof establishment allocation', inject([ActivatedRoute], (route: ActivatedRoute) => {
      route.queryParams = of({ receiptNo: '12563365' });
      spyOn(component, 'getMofEstablishmentDetails');
      component.ngOnInit();
      expect(component.getMofEstablishmentDetails).toHaveBeenCalled();
    }));
  });
  describe('test suite for getMofEstablishmentDetails', () => {
    it('It should get the mof establishment allocation details', () => {
      component.getMofEstablishmentDetails();
      expect(component.estAllocationDetails).not.toEqual(null);
      expect(component.branchDetails).not.toEqual(null);
    });
  });
  describe('test suite for getMofReceiptDetails', () => {
    it('It should get the mof receipt details', () => {
      spyOn(component.contributionPaymentService, 'getReceiptDetails').and.callThrough();
      component.getMofReceiptDetails();
      expect(component.contributionPaymentService.getReceiptDetails).toHaveBeenCalled();
    });
  });
  describe('test suite for getEstablishmentAllocation', () => {
    it('It should get the establishment allocation details', () => {
      component.getEstablishmentAllocation(502351249);
      component.regNumber = 502351249;
      expect(component.branchDetails).not.toBe(null);
    });
  });
  describe('navigateBackToPage', () => {
    it('navigate to bill dashborad  screen', () => {
      spyOn(component.router, 'navigate');
      component.navigateBackToPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/billing/receipt/mof']);
    });
    it('getSelectedPageDetails', () => {
      spyOn(component, 'getMofEstablishmentAllocationDetails').and.callThrough();
      component.getSelectedPageDetails(1);
      component.pageNo = 1;
      expect(component.getMofEstablishmentAllocationDetails).toHaveBeenCalled();
    });
    it('getMofReceiptDetails', () => {
      spyOn(component.contributionPaymentService, 'getReceiptDetails').and.callThrough();
      component.getMofReceiptDetails();
      expect(component.contributionPaymentService.getReceiptDetails).toHaveBeenCalled();
      expect(component.receipt).not.toEqual(null);
    });

    it('getEstablishmentAllocationFilterValue', () => {
      const filterParam = {
        allocationDate: { gregorain: '', hijri: '' },
        maxAmount: 52,
        minAmount: 10
      };

      component.filterParam = new MofAllocationBreakupFilter().fromJsonToObject(filterParam);

      spyOn(component, 'getMofEstablishmentAllocationDetails').and.callThrough();
      component.getEstablishmentAllocationFilterValue(component.filterParam);
      component.pageNo = 1;
      component.filterParam = component.filterParam;
      expect(component.getMofEstablishmentAllocationDetails).toHaveBeenCalled();
    });
  });
});
