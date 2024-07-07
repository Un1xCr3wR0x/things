import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { HoldBenefitTransactionScComponent } from './hold-benefit-transaction-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  EnvironmentToken,
  ApplicationTypeToken,
  DocumentItem,
  LanguageToken,
  RouterDataToken,
  RouterData,
  TransactionService,
  Transaction,
  TransactionParams
} from '@gosi-ui/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ModifyBenefitService,
  HoldBenefitDetails,
  BenefitDocumentService,
  Contributor,
  HoldPensionDetails
} from '../../../shared';
import { of, BehaviorSubject } from 'rxjs';
import { ModalServiceStub, BilingualTextPipeMock } from 'testing';
import { DatePipe } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';

describe('HoldBenefitTransactionScComponent', () => {
  let component: HoldBenefitTransactionScComponent;
  let fixture: ComponentFixture<HoldBenefitTransactionScComponent>;
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

  const modifyBenefitServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getHoldBenefitDetails'
  ]);
  modifyBenefitServiceSpy.getHoldBenefitDetails.and.returnValue(
    of({
      ...new HoldBenefitDetails(),
      pension: { ...new HoldPensionDetails(), annuityBenefitType: { english: '', arabic: '' } },
      contributor: { ...new Contributor(), identity: [] }
    })
  );
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getAllDocuments'
  ]);
  benefitDocumentServicespy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [HoldBenefitTransactionScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },

        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: TransactionService, useValue: transactionServiceSpy },
        { provide: ModifyBenefitService, useValue: modifyBenefitServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldBenefitTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' getHoldDetails', () => {
    it('should  getHoldDetails', () => {
      component.socialInsuranceNo = 2334254453;
      component.benefitrequestId = 23342321212;
      component.referenceNo = 2334232;
      component.getHoldDetails(component.socialInsuranceNo, component.benefitrequestId, component.referenceNo);
      expect(component.getHoldDetails).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should readFullNote', () => {
      const noteText = 'afdfdf';
      component.readFullNote(noteText);
      expect(component.readFullNote).toBeDefined();
    });
  });
});
