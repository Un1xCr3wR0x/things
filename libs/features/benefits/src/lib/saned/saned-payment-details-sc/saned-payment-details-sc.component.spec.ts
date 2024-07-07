/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { bankDetailsByIBAN, ModalServiceStub, ManageBenefitMockService } from 'testing';
import { SanedPaymentDetailsScComponent } from './saned-payment-details-sc.component';
import { UiBenefitsService } from '../../shared';

describe('SanedPaymentDetailsScComponent', () => {
  let component: SanedPaymentDetailsScComponent;
  let fixture: ComponentFixture<SanedPaymentDetailsScComponent>;
  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', ['getBank']);
  lookupServiceSpy.getBank.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, BrowserDynamicTestingModule, RouterTestingModule],
      declarations: [SanedPaymentDetailsScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder,
        { provide: UiBenefitsService, useClass: ManageBenefitMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SanedPaymentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('getPaymentDetails', () => {
    it('should getPaymentDetails', () => {
      component.getPaymentDetails();
      expect(component.benfitsPayment).not.toBeNull();
    });
  });
});
