/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentItem,
  bindToObject,
  DocumentService,
  Transaction,
  TransactionParams,
  TransactionService
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, documentListItemArray } from 'testing';
import { RequestHeirBenefitScComponent } from './request-heir-benefit-sc.component';
import { BenefitDocumentService, FuneralBenefitService, FuneralGrantBeneficiaryResponse } from '../../../shared';

describe('RequestHeirBenefitScComponent', () => {
  let component: RequestHeirBenefitScComponent;
  let fixture: ComponentFixture<RequestHeirBenefitScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', ['refreshDocument']);
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getRequiredDocuments',
    'fetchDocs'
  ]);
  benefitDocumentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.fetchDocs.and.returnValue(of([new DocumentItem()]));
  const funeralBenefitServicespy = jasmine.createSpyObj<FuneralBenefitService>('funeralBenefitService', [
    'getBeneficiaryRequestDetails'
  ]);
  const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails'
  ]);
  transactionServiceSpy.getTransactionDetails.and.returnValue({
    ...new Transaction(),
    fromJsonToObject: json => json,
    transactionRefNo: 1234,
    transactionId: 1234,
    businessId: 1234,
    params: {
      ...new TransactionParams(),
      IDENTIFIER: '1234',
      MISC_PAYMENT_ID: 1234
    }
  });
  funeralBenefitServicespy.getBeneficiaryRequestDetails.and.returnValue(of(new FuneralGrantBeneficiaryResponse()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: FuneralBenefitService, useValue: funeralBenefitServicespy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [RequestHeirBenefitScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestHeirBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should initialise  details', () => {
      expect(component.referenceNumber).not.toEqual(null);
      expect(component.transactionId).not.toEqual(null);
      expect(component.socialInsuranceNo).not.toEqual(null);
      expect(component.requestId).not.toEqual(null);
      component.ngOnInit();
    });
    /* it('getTransactionDetails', () => {
      const transaction = {
        transactionRefNo: 12345,
        title: {
          english: 'abc',
          arabic: ''
        },
        description: null,
        contributorId: 132123,
        establishmentId: 12434,
        initiatedDate: null,
        lastActionedDate: null,
        status: null,
        channel: null,
        transactionId: 101574,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BUSINESS_ID: 3527632,
          BENEFIT_REQUEST_ID: 1234445456,
          SIN: 1234
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.requestId).not.toBe(null);
    });*/
    it('should get Beneficiary Details', () => {
      component.socialInsuranceNo = 88888;
      component.referenceNumber = 4444;
      component.requestId = 888;
      spyOn(component, 'getBeneficiaryDetails');
      expect(component.funeralBeneficiaryDetails).not.toEqual(null);
    });
  });
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      component.refreshDocument(document);
      expect(component.refreshDocument).not.toBeNull();
    });
  });
});
