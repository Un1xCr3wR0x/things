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
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentItem,
  DocumentService,
  EnvironmentToken,
  LanguageToken,
  UuidGeneratorService,
  CommonIdentity
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, DocumentServiceStub, ModalServiceStub } from 'testing';
import {
  ActiveBenefits,
  AssessmentDetails,
  BenefitResponse,
  BypassReassessmentService,
  Contributor,
  HoldBenefitDetails
} from '../../shared';
import { AssessmentDecisionDisplayScComponent } from './assessment-decision-display-sc.component';

describe('AssessmentDecisionDisplayScComponent', () => {
  let component: AssessmentDecisionDisplayScComponent;
  let fixture: ComponentFixture<AssessmentDecisionDisplayScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const uuidGeneratorServiceSpy = jasmine.createSpyObj<UuidGeneratorService>('UuidGeneratorService', ['getUuid']);
  uuidGeneratorServiceSpy.getUuid.and.returnValue('2AAUI');
  const bypassReaassessmentServiceSpy = jasmine.createSpyObj<BypassReassessmentService>('BypassReassessmentService', [
    'getMedicalAssessment',
    'acceptStandaloneAssessment',
    'getStandaloneAssessment',
    'appealStandaloneAssessment',
    'submitMedicalAssesment'
  ]);

  bypassReaassessmentServiceSpy.getMedicalAssessment.and.returnValue(
    of({
      ...new HoldBenefitDetails(),
      CommonId: { ...new CommonIdentity(), idType: 'qwqw' },
      contributor: { ...new Contributor(), identity: [] }
    })
  );
  bypassReaassessmentServiceSpy.acceptStandaloneAssessment.and.returnValue(of(new BenefitResponse()));
  bypassReaassessmentServiceSpy.getStandaloneAssessment.and.returnValue(
    of({ ...new HoldBenefitDetails(), assessmentDetails: { ...new AssessmentDetails(), recordStatus: 'Accepted' } })
  );
  bypassReaassessmentServiceSpy.appealStandaloneAssessment.and.returnValue(of(new BenefitResponse()));
  bypassReaassessmentServiceSpy.submitMedicalAssesment.and.returnValue(of(new BenefitResponse()));
  /*const modifyPensionServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getSavedActiveBenefit'
  ]);
  modifyPensionServiceSpy.getSavedActiveBenefit.and.returnValue(new ActiveBenefits(1234, 1234, { english: '', arabic: '' }, 1234));*/
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [AssessmentDecisionDisplayScComponent],
      providers: [
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: BypassReassessmentService, useValue: bypassReaassessmentServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        DatePipe,
        FormBuilder,
        //{ provide: ModifyBenefitService, useValue: modifyPensionServiceSpy },
        { provide: UuidGeneratorService, useValue: uuidGeneratorServiceSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentDecisionDisplayScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xdescribe('ngOnInit', () => {
    it('should ngOnInit', () => {
      (component.assessmentRequestId = 104), (component.referenceNo = 128457), (component.nin = 1039794597);
      component.transactionId;
      component.doctransactionType;
      spyOn(component, 'getScreenSize');
      component.ngOnInit();
      expect(component.activeBenefit).not.toEqual(null);
    });
  });
  describe('checkApplicationType', () => {
    it('should checkApplicationType', () => {
      component.checkApplicationType();
      expect(component.checkApplicationType).toBeTruthy();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeTruthy();
    });
  });
  describe('getScreenSize', () => {
    it('should getScreenSize', () => {
      component.getScreenSize();
      component.isSmallScreen = false;
      expect(component.getScreenSize).toBeDefined();
    });
  });
  describe('getModifyRequiredDocs', () => {
    it('should getModifyRequiredDocs', () => {
      spyOn(component.documentService, 'getRequiredDocuments').and.callThrough();
      component.getModifyRequiredDocs('1234556', 'UITransactionType.GOL_REQUEST_SANED');
      expect(component.documentService.getRequiredDocuments).toHaveBeenCalledWith(
        '1234556',
        'UITransactionType.GOL_REQUEST_SANED'
      );
      expect(component.getModifyRequiredDocs).not.toBeNull();
    });
  });
  describe('setActiveBenefitValues', () => {
    it('should setActiveBenefitValues', () => {
      component.activeBenefit = new ActiveBenefits(1234, 1234, { english: '', arabic: '' }, 1234);
      component.setActiveBenefitValues();
      expect(component.referenceNo).not.toEqual(null);
    });
  });
  describe('getIdentityLabel', () => {
    it('should getIdentityLabel', () => {
      const CommonId: CommonIdentity = {
        idType: 'ddfdfdf',
        id: 2323
      };
      component.getIdentityLabel(CommonId);
      expect(component.getIdentityLabel).not.toEqual(null);
    });
  });
  xdescribe('getMedicalAssessment', () => {
    it('should getMedicalAssessment', () => {
      component.getMedicalAssessment();
      const Common: CommonIdentity = {
        idType: 'ddfdfdf',
        id: 2323
      };
      const CommonId = { ...new CommonIdentity(), idType: 'dsdsd' };
      component.getIdentityLabel(CommonId);
      expect(component.identityLabel).toEqual(component.getIdentityLabel(Common));
      expect(component.holdBenefitDetails).not.toEqual(null);
    });
  });
  /*describe('acceptStandaloneAssessment', () => {
    it('should acceptStandaloneAssessment', () => {
      component.referenceNo = 1234;
      component.nin = 1234;
      component.benefitsForm = new FormGroup({amount: new FormControl({value: ''})});
      component.declarationDone = true;
      component.acceptStandaloneAssessment();
      expect(component.benefitResponse).not.toEqual(null);
    });
  });*/
  /*describe('getStandaloneAssessment', () => {
    it('should getStandaloneAssessment', () => {
      component.referenceNo = 1234;
      component.nin = 1234;
      component.getStandaloneAssessment();
      expect(component.holdBenefitDetails).not.toEqual(null);
    });
  });*/
  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      component.assessmentRequestId = 1234;
      component.transactionId = '1234';
      component.doctransactionType = 'benefit';
      component.referenceNo = 1234;
      component.uuid = '2AAUI';
      component.refreshDocument({
        ...new DocumentItem(),
        name: { english: '', arabic: '' },
        fromJsonToObject: json => json
      });
      expect(component.refreshDocument).toBeDefined();
    });
  });
  describe('showAppeal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showAppeal(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('hideModal', () => {
    it('should hide modal reference', () => {
      component.modalRef = new BsModalRef();
      component.hideModal();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('changeCheck', () => {
    it('should changeCheck', () => {
      component.changeCheck({ target: { checked: true } });
      expect(component.declarationDone).toEqual(true);
    });
  });
  describe('submitAssessmentDetails', () => {
    it('should submitAssessmentDetails', () => {
      component.assessmentRequestId = 1234;
      component.benefitRequestId = 1234;
      component.sin = 1234;
      spyOn(component, 'checkMandatoryDocs').and.returnValue(true);
      component.submitAssessmentDetails();
      expect(component.benefitResponse).not.toEqual(null);
    });
  });
  describe('acceptAssessment', () => {
    it('should acceptAssessment', () => {
      component.currentTab = 1;
      component.acceptAssessment();
      expect(component.currentTab).not.toEqual(null);
    });
  });
  describe('checkMandatoryDocs', () => {
    it('should checkMandatoryDocs', () => {
      component.documentList = [new DocumentItem()];
      component.checkMandatoryDocs();
      expect(component.checkMandatoryDocs).toBeDefined();
    });
  });
  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      component.modalRef = new BsModalRef();
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      component.modalRef = new BsModalRef();
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.modalRef).not.toBeNull();
    });
  });
  describe('confirm', () => {
    it('confirm', () => {
      component.modalRef = new BsModalRef();
      component.confirm();
      expect(component.confirm).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
});
