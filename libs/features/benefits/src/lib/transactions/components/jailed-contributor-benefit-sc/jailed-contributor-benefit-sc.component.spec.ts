/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EnvironmentToken,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  RouterDataToken,
  RouterData,
  LanguageToken,
  bindToObject,
  DocumentItem
} from '@gosi-ui/core';

import { JailedContributorBenefitScComponent } from './jailed-contributor-benefit-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub, ModalServiceStub, BilingualTextPipeMock, uiBenefits } from 'testing';
import { BehaviorSubject, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import { AnnuityResponseDto } from '../../../shared/models/annuity-responsedto';
import { ManageBenefitService, DependentService, ImprisonmentDetails, BenefitDocumentService } from '../../../shared';

describe('JailedContributorBenefitScComponent', () => {
  let component: JailedContributorBenefitScComponent;
  let fixture: ComponentFixture<JailedContributorBenefitScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail'
  ]);
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', ['getImprisonmentDetails']);
  dependentServiceSpy.getImprisonmentDetails.and.returnValue(of(new ImprisonmentDetails()));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments'
  ]);
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: DependentService, useValue: dependentServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [JailedContributorBenefitScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JailedContributorBenefitScComponent);
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
        channel: null,
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
    });
  });
  describe('getAnnuityBenefitRequestDetail', () => {
    it('should fetch AnnuityBenefitRequestDetail', () => {
      component.ngOnInit();
      expect(component.manageBenefitService.getAnnuityBenefitRequestDetail).toBeDefined();
      fixture.detectChanges();
      expect(component.getImprisonmentModifyDet).toBeDefined();
    });
  });
  describe('getImprisonmentModifyDet', () => {
    it('it should  getImprisonmentModifyDet', () => {
      component.getImprisonmentModifyDet();
      expect(component.getImprisonmentModifyDet).toBeDefined();
    });
  });
  describe(' getImprisonmentAdjustments(', () => {
    it('it should  getImprisonmentAdjustments(', () => {
      const sin = 32546411;
      const requestId = 4454545;
      component.getImprisonmentAdjustments(sin, requestId);
      expect(component.getImprisonmentAdjustments).toBeDefined();
    });
  });
  describe('fetchDocumentsForImprisonmentModify', () => {
    it('should fetchDocumentsForImprisonmentModify', () => {
      spyOn(component, 'fetchDocumentsForImprisonmentModify').and.callThrough();
      component.fetchDocumentsForImprisonmentModify();
      expect(component.benefitDocumentService.getUploadedDocuments).toBeDefined();
      expect(component.documents).not.toBeNull();
    });
  });
});
