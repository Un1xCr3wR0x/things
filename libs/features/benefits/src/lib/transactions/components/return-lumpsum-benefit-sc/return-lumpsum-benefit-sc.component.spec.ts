/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EnvironmentToken,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  BilingualText,
  Alert,
  bindToObject,
  LanguageToken,
  DocumentItem
} from '@gosi-ui/core';

import { ReturnLumpsumBenefitScComponent } from './return-lumpsum-benefit-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub, ModalServiceStub } from 'testing/mock-services';
import {
  ReturnLumpsumDetails,
  AnnuityResponseDto,
  BenefitType,
  BenefitDocumentService,
  ReturnLumpsumPaymentDetails,
  ReturnLumpsumService
} from '../../../shared';
import { of, BehaviorSubject } from 'rxjs';
import { uiBenefits, BilingualTextPipeMock } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';

describe('ReturnLumpsumBenefitScComponent', () => {
  let component: ReturnLumpsumBenefitScComponent;
  let fixture: ComponentFixture<ReturnLumpsumBenefitScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const repaymentDetails: ReturnLumpsumPaymentDetails = {
    paymentMethod: { english: '23223', arabic: '' },
    receiptMode: { english: 'sdsdd', arabic: '' }
  };

  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getLumpsumRepaymentDetails',
    'setRepayId',
    'setBenefitReqId'
  ]);
  returnLumpsumServicespy.getLumpsumRepaymentDetails.and.returnValue(of(new ReturnLumpsumDetails()));

  returnLumpsumServicespy.getLumpsumRepaymentDetails.and.returnValue(
    of({ ...new ReturnLumpsumDetails(), repaymentDetails, benefitType: { english: '23223', arabic: '' } })
  );
  /*const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
  ]);
 benefitDocumentServicespy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));*/
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        //{ provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: Router, useValue: routerSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        FormBuilder
      ],
      declarations: [ReturnLumpsumBenefitScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnLumpsumBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('getTransactionDetails', () => {
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
        channel: {
          arabic: 'المكتب الميداني ',
          english: 'Field Office'
        },
        transactionId: 101574,
        registrationNo: 132123,
        sin: 41224,
        businessId: 2144,
        taskId: 'sdvjsvjdvasvd',
        assignedTo: 'admin',
        params: {
          BENEFIT_REQUEST_ID: 3527632,
          SIN: 1234445456
        }
      };
      component.transactionService.setTransactionDetails(transaction);
      component.ngOnInit();
      expect(component.referenceNumber).not.toBe(null);
      expect(component.socialInsuranceNo).not.toBe(null);
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe(' setBenefitVariables', () => {
    it('should  setBenefitVariables hazardousLumpsum', () => {
      component.benefitType = 'Retirement Lumpsum Benefit (Hazardous Occupation)';
      component.isHazardous = true;
      expect(component.isHazardous).toBeTrue();
      component.setBenefitVariables('Retirement Lumpsum Benefit (Hazardous Occupation)');
      expect(component.benefitType).toEqual('Retirement Lumpsum Benefit (Hazardous Occupation)');
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables jailedContributorLumpsum', () => {
      component.benefitType = 'Jailed Contributor Lumpsum Benefit';
      component.isJailedLumpsum = true;
      component.setBenefitVariables('Jailed Contributor Lumpsum Benefit');
      expect(component.benefitType).toEqual('Jailed Contributor Lumpsum Benefit');
      expect(component.isJailedLumpsum).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables occLumpsum', () => {
      component.benefitType = 'Occupational Disability Lumpsum Benefit';
      component.isOcc = true;
      component.setBenefitVariables('Occupational Disability Lumpsum Benefit');
      expect(component.benefitType).toEqual('Occupational Disability Lumpsum Benefit');
      expect(component.isOcc).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables isNonOcc', () => {
      component.isNonOcc = true;
      component.benefitType = 'Non-Occupational Disability Lumpsum Benefit';
      component.setBenefitVariables('Non-Occupational Disability Lumpsum Benefit');
      expect(component.benefitType).toEqual('Non-Occupational Disability Lumpsum Benefit');
      expect(component.isNonOcc).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables isWomenLumpsum ', () => {
      component.isWomenLumpsum = true;
      component.benefitType = 'Woman Lumpsum Benefit';
      component.setBenefitVariables('Woman Lumpsum Benefit');
      expect(component.benefitType).toEqual('Woman Lumpsum Benefit');
      expect(component.isWomenLumpsum).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
    it('should  setBenefitVariables isHeir', () => {
      component.isHeir = true;
      component.benefitType = 'Heir Lumpsum Benefit';
      component.setBenefitVariables('Heir Lumpsum Benefit');
      expect(component.benefitType).toEqual('Heir Lumpsum Benefit');
      expect(component.isHeir).toBeTrue();
      expect(component.setBenefitVariables).toBeDefined();
    });
  });
  describe('getAnnuityBenefitRequestDetail', () => {
    it('should fetch AnnuityBenefitRequestDetail', () => {
      spyOn(component.manageBenefitService, 'getAnnuityBenefitRequestDetail').and.returnValue(
        of(bindToObject(new AnnuityResponseDto(), uiBenefits))
      );
      component.ngOnInit();
      expect(component.manageBenefitService.getAnnuityBenefitRequestDetail).toBeDefined();
      fixture.detectChanges();
      expect(component.contributorDetails).not.toBeNull();
    });
    it('should   viewContributorDetails', () => {
      component.viewContributorDetails();
    });
  });

  describe('getLumpsumRepaymentDetails', () => {
    it('should fetch UI getLumpsumRepaymentDetails', () => {
      const sin = 230066639;
      const benefitRequestId = 18989782;
      const repayID = 166266;
      component.getLumpsumRepaymentDetails(sin, benefitRequestId, repayID);
      expect(component.alertService.showError);
    });
  });

  describe('fetchDocuments', () => {
    it('should fetch documents', () => {
      spyOn(component, 'fetchDocuments').and.callThrough();
      component.fetchDocuments();
      //spyOn (component.benefitDocumentService, 'getUploadedDocuments').and.returnValue(of([new DocumentItem()]));
      //expect(component.benefitDocumentService.getUploadedDocuments).toBeDefined();
      expect(component.documents).not.toBeNull();
    });
  });

  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('showErrorMessages', () => {
    it('should et show error message', () => {
      const messageKey = { english: 'test', arabic: 'test' };
      component.alertService.showError(messageKey);
      expect(component.showErrorMessages).toBeTruthy();
    });
  });
  describe('fetchDocumentsForOtherPayment', () => {
    it('should fetchDocumentsForOtherPayment', () => {
      component.fetchDocumentsForOtherPayment();
      expect(component.fetchDocumentsForOtherPayment).toBeDefined();
    });
  });
  describe('fetchDocumentsForRestore', () => {
    it('should fetchDocumentsForRestore', () => {
      const enableLumpsumRepaymentId = 235445;
      component.fetchDocumentsForRestore(enableLumpsumRepaymentId);
      expect(component.fetchDocumentsForRestore).toBeDefined();
    });
  });
  describe('fetchDocumentsForOtherPayment', () => {
    it('should fetchDocumentsForOtherPayment', () => {
      component.fetchDocumentsForOtherPayment();
      expect(component.fetchDocumentsForOtherPayment).toBeDefined();
    });
  });
  describe('setBenefitVariables', () => {
    it('should setBenefitVariables', () => {
      const benefitType = '235445';
      component.setBenefitVariables(benefitType);
      expect(component.setBenefitVariables).toBeDefined();
    });
  });
});
