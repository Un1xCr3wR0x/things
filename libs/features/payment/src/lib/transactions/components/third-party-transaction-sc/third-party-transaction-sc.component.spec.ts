/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { DatePipe } from '@angular/common';
import {
  AlertService,
  DocumentService,
  RouterDataToken,
  RouterData,
  bindToObject,
  ApplicationTypeToken,
  TransactionService,
  Transaction,
  TransactionParams,
  LookupService,
  CoreAdjustmentService
} from '@gosi-ui/core';
import {
  AlertServiceStub,
  DocumentServiceStub,
  ModalServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  LookupServiceStub
} from 'testing';
import {
  AdjustmentService,
  ThirdpartyAdjustmentService,
  AdjustmentDetails,
  Adjustment,
  PayeeDetails,
  BeneficiaryList
} from '../../../shared';

import { ThirdPartyTransactionScComponent } from './third-party-transaction-sc.component';
import { of } from 'rxjs';
import { activeAdjustments, benefits } from '../../../shared/test-data/adjustment';
import { contributor } from '../../../shared/test-data/adjustment-repayment';

describe('ThirdPartyTransactionScComponent', () => {
  let component: ThirdPartyTransactionScComponent;
  let fixture: ComponentFixture<ThirdPartyTransactionScComponent>;
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setQueryParams({ id: 1600765 });

  const thirdPartyAdjustmentServiceSpy = jasmine.createSpyObj<ThirdpartyAdjustmentService>(
    'ThirdpartyAdjustmentService',
    [
      'revertTransaction',
      'getTpaAdjustmentsDetails',
      'getThirdPartyAdjustmentValidatorDetails',
      'getValidatorPayeeDetails',
      'submitAdjustmentDetails',
      'getBeneficiaryDetails',
      'getPersonById'
    ]
  );
  thirdPartyAdjustmentServiceSpy.revertTransaction.and.returnValue(of({}));
  thirdPartyAdjustmentServiceSpy.getTpaAdjustmentsDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getThirdPartyAdjustmentValidatorDetails.and.returnValue(
    of({ ...new AdjustmentDetails(), adjustments: [{ ...new Adjustment(), ...activeAdjustments.adjustments }] })
  );
  thirdPartyAdjustmentServiceSpy.getValidatorPayeeDetails.and.returnValue(
    of({ ...new PayeeDetails(), iban: 'SA12345678' })
  );
  thirdPartyAdjustmentServiceSpy.submitAdjustmentDetails.and.returnValue(of({ message: '' }));
  thirdPartyAdjustmentServiceSpy.getBeneficiaryDetails.and.returnValue(
    of({ ...new BeneficiaryList(), beneficiaryBenefitList: benefits.beneficiaryBenefitList })
  );
  thirdPartyAdjustmentServiceSpy.getPersonById.and.returnValue(of(contributor));
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
      MISC_PAYMENT_ID: 1234445456,
      IDENTIFIER: '1234'
    }
  };

  const transactionServiceSpy = jasmine.createSpyObj<TransactionService>('TransactionService', [
    'getTransactionDetails',
    'setTransactionDetails'
  ]);
  transactionServiceSpy.getTransactionDetails.and.returnValue({
    ...new Transaction(),
    fromJsonToObject: json => json,
    transactionRefNo: 1234,
    transactionId: 1234,
    businessId: 1234,
    params: {
      ...new TransactionParams(),
      IDENTIFIER: '1234'
    },
    ...transaction
  });
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const personId = 1234;
  const modificationId = 1234;
  const referenceNumber = 1234;
  const adjustmentId = 1234;
  const coreAdjustmntServiceSpy = jasmine.createSpyObj<CoreAdjustmentService>('CoreAdjustmentService', [
    'identifier',
    'benefitType',
    'benefitDetails'
  ]);
  coreAdjustmntServiceSpy.identifier = 1234;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: CoreAdjustmentService, useValue: coreAdjustmntServiceSpy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ThirdpartyAdjustmentService, useValue: thirdPartyAdjustmentServiceSpy },
        DatePipe
      ],
      declarations: [ThirdPartyTransactionScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdPartyTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('getTransactionDetails', () => {
    component.ngOnInit();
    expect(component.transactionId).not.toBe(null);
  });
  it('should fetchAddTpaValidatorView', () => {
    component.personId = personId;
    component.modificationId = modificationId;
    component.fetchAddTpaValidatorView();
    expect(component.adjustmentResponse).not.toEqual(null);
  });
  it('should getBenefitDetails', () => {
    component.beneficiaryId = 1234;
    component.getBenefitDetails(personId);
    expect(component.benefitResponse).not.toEqual(null);
  });
  it('should navigateToBenefitViewPage', () => {
    component.personId = personId;
    component.navigateToBenefitViewPage({ english: 'Pension', arabic: 'Pension' });
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should fetchManageTpaAdjustment', () => {
    component.personId = personId;
    component.modificationId = modificationId;
    component.referenceNumber = referenceNumber;
    component.fetchManageTpaAdjustment();
    expect(component.modifiedAdjustmentValues).not.toEqual(null);
  });
  it('should get Contributor', () => {
    component.personId = personId;
    component.getContributor();
    expect(component.sin).not.toEqual(null);
  });
  it('should get modify Tpa documents', () => {
    component.getModifyTpaDocuments(
      [
        { ...new Adjustment(), ...activeAdjustments.adjustments[0] },
        { ...new Adjustment(), ...activeAdjustments.adjustments[1] },
        {
          ...new Adjustment(),
          ...activeAdjustments.adjustments[1],
          actionType: {
            english: 'Stop',
            arabic: 'Stop'
          }
        },
        {
          ...new Adjustment(),
          ...activeAdjustments.adjustments[1],
          actionType: {
            english: 'Hold',
            arabic: 'Hold'
          }
        },
        {
          ...new Adjustment(),
          ...activeAdjustments.adjustments[1],
          actionType: {
            english: 'Reactivate',
            arabic: 'Reactivate'
          }
        }
      ],
      referenceNumber,
      modificationId
    );
    expect(component.allDocuments).not.toEqual(null);
  });
  it('should hide  popup', () => {
    component.modalRef = new BsModalRef();
    component.hideModal();
    expect(component.modalRef).not.toEqual(null);
  });
  it('should navigate To Adjustment Page', () => {
    component.personId = personId;
    component.navigateToAdjustmentPage(adjustmentId);
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should navigateOnLinkClick', () => {
    component.sin = transaction.sin;
    component.navigateOnLinkClick();
    expect(component.router.navigate).toHaveBeenCalled();
  });
  it('should viewMaintainAdjustment', () => {
    component.personId = personId;
    component.viewMaintainAdjustment(new AdjustmentDetails());
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
