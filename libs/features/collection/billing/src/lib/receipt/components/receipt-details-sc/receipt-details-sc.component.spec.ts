/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptDetailsScComponent } from './receipt-details-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import {
  BilingualTextPipeMock,
  StorageServiceStub,
  BillDashboardServiceStub,
  ContributionPaymentServiceStub,
  DocumentServiceStub,
  BillEstablishmentServiceStub,
  ExchangeRateServiceStub,
  LookupServiceStub,
  establishmentDetailsGCC
} from 'testing';
import {
  StorageService,
  DocumentService,
  ExchangeRateService,
  LookupService,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  RouterDataToken,
  RouterData
} from '@gosi-ui/core';
import { BillDashboardService, ContributionPaymentService, EstablishmentService } from '../../../shared/services';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { EstablishmentDetails } from '../../../shared/models';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('ReceiptDetailsScComponent', () => {
  let component: ReceiptDetailsScComponent;
  let fixture: ComponentFixture<ReceiptDetailsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [ReceiptDetailsScComponent],
      providers: [
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: BillDashboardService, useClass: BillDashboardServiceStub },
        { provide: ContributionPaymentService, useClass: ContributionPaymentServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        { provide: ExchangeRateService, useClass: ExchangeRateServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: ApplicationTypeToken,
          useValue: 'PUBLIC'
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('It should get the receipt details for non gcc establishment', () => {
    component.idNumber = 502351249;
    component.getReceiptDetails(24530824);
    expect(component.receipt).toBeDefined();
  });

  it('It should get the receipt details for gcc establishment', () => {
    spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
      of(new EstablishmentDetails().fromJsonToObject(establishmentDetailsGCC))
    );
    component.idNumber = 502351249;
    component.getReceiptDetails(24530824);
    expect(component.receipt).toBeDefined();
  });
  it('It should get the receipt details for mof establishment', () => {
    spyOn(component.establishmentService, 'getEstablishment').and.returnValue(
      of(new EstablishmentDetails().fromJsonToObject(establishmentDetailsGCC))
    );
    component.idNumber = 1;
    component.getReceiptDetails(24530824);
    expect(component.receipt).toBeDefined();
  });
  it('It should navigateBack', () => {
    spyOn(component.router, 'navigate');
    component.isMofReceiptFlag = false;
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith(
      ['home/billing/receipt/establishment'],
      Object({ queryParams: Object({ pageNo: undefined, searchFlag: true, idNo: undefined }) })
    );
  });
  it('It should navigateBackss', () => {
    spyOn(component.router, 'navigate');
    component.isMofReceiptFlag = true;
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith(
      ['home/billing/receipt/mof'],
      Object({ queryParams: Object({ pageNo: undefined }) })
    );
  });
  it('It should getMofAllocationBreakupDetails', () => {
    spyOn(component.router, 'navigate');
    component.getMofAllocationBreakupDetails();
    expect(component.router.navigate).toHaveBeenCalledWith(
      ['home/billing/receipt/mof/allocationDetails'],
      Object({ queryParams: Object({ receiptNo: undefined }) })
    );
  });
  it('It should navigateToCancelReceipt', () => {
    spyOn(component.router, 'navigate');
    component.navigateToCancelReceipt(5555);
    component.contributionPaymentService.receiptNumber = 5555;
    component.contributionPaymentService.registrationNumber = 11111;
    expect(component.router.navigate).toHaveBeenCalledWith(['home/billing/payment/cancel-establishment-payment']);
  });
});
