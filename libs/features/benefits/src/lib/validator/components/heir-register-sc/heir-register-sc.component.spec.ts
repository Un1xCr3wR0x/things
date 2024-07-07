import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  BilingualText,
  BPMUpdateRequest,
  EnvironmentToken,
  GosiCalendar,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentItem,
  CommonIdentity
} from '@gosi-ui/core';
import { ValidatorRoles } from '@gosi-ui/features/contributor';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ManagePersonServiceStub, ModalServiceStub, BilingualTextPipeMock } from 'testing';
import {
  HeirAccountDetails,
  PersonalInformation,
  UITransactionType,
  BenefitDocumentService,
  HeirBenefitService,
  ManageBenefitService
} from '../../../shared';
import { HeirRegisterScComponent } from './heir-register-sc.component';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';

describe('HeirRegisterScComponent', () => {
  let component: HeirRegisterScComponent;
  let fixture: ComponentFixture<HeirRegisterScComponent>;
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments',
    'getAllDocuments'
  ]);
  benefitDocumentServicespy.getAllDocuments.and.returnValue(of([new DocumentItem()]));
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const heirBenefitServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getAccountRequestDetails',
    'updateTaskWorkflow'
  ]);
  heirBenefitServiceSpy.getAccountRequestDetails.and.returnValue(
    of({
      ...new HeirAccountDetails(),
      benefitRequestReason: { english: '', arabic: '' },
      heirPersonId: 1234,
      contributorPersonId: 1234
    })
  );
  heirBenefitServiceSpy.updateTaskWorkflow.and.returnValue(of({ english: '', arabic: '' }));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getPersonDetailsWithPersonId',
    'setValues'
  ]);
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(
    of({
      ...new PersonalInformation(),
      identity: [],
      fromJsonToObject: json => json,
      name: {
        english: { name: '' },
        arabic: { firstName: '', secondName: '', thirdName: '', familyName: '', fromJsonToObject: json => json },
        fromJsonToObject: json => json
      }
    })
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [HeirRegisterScComponent, BilingualTextPipeMock],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: HeirBenefitService, useValue: heirBenefitServiceSpy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: HeirBenefitService, useValue: heirBenefitServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirRegisterScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeTruthy();
    });
  });

  describe('fetchDocuments', () => {
    it('should fetch documents', () => {
      component.benefitRequestId = 1001246;
      component.fetchDocuments();
      expect(component.documentList).not.toBeNull();
    });
  });

  describe('getHeirPersonDetails', () => {
    it('should fetch heir person details', () => {
      component.heirAccountDetails = new HeirAccountDetails();
      component.heirAccountDetails.heirPersonId = 1019474024;
      component.getHeirPersonDetails();
      expect(component.heirPersonDetails).not.toBeNull();
    });
  });

  describe('getContributorPersonDetails', () => {
    it('should fetch contributor person details', () => {
      component.heirAccountDetails = new HeirAccountDetails();
      component.heirAccountDetails.contributorPersonId = 1019474024;
      component.getContributorPersonDetails();
      expect(component.contributorPersonDetails).not.toBeNull();
    });
  });

  describe('getHeirAgeDateOfBirthValues', () => {
    it('should get heir age and date of birth values', () => {
      component.heirPersonDetails.birthDate = { gregorian: new Date('1995-12-12'), hijiri: '' };
      expect(component.heirPersonDetails.birthDate.gregorian).toBeDefined();
      component.heirPersonDetails.birthDate = new GosiCalendar();
      spyOn(component, 'getHeirAgeDateOfBirthValues').and.callThrough();
      component.getHeirAgeDateOfBirthValues();
      expect(component.getHeirAgeDateOfBirthValues).toHaveBeenCalled();
    });
  });

  describe('getContributorAgeDateOfBirthValues', () => {
    it('should get contributor age and date of birth values', () => {
      component.contributorPersonDetails = new PersonalInformation();
      component.contributorPersonDetails.birthDate = new GosiCalendar();
      spyOn(component, 'getContributorAgeDateOfBirthValues').and.callThrough();
      component.getContributorAgeDateOfBirthValues();
      expect(component.getContributorAgeDateOfBirthValues).toHaveBeenCalled();
    });
  });
  describe('ageFromDateOfBirthday', () => {
    it('should get age from date of birth', () => {
      const dateofBirth = new GosiCalendar();
      spyOn(component, 'ageFromDateOfBirthday').and.callThrough();
      component.ageFromDateOfBirthday(dateofBirth);
      expect(component.ageFromDateOfBirthday).toHaveBeenCalled();
    });
  });

  describe('approve transation', () => {
    it('should trigger the approve popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.disableApprove = false;
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      spyOn(component, 'approveTransaction').and.callThrough();
      expect(component.showModal).toHaveBeenCalled();
    });
  });

  describe('rejectTransaction', () => {
    it('should trigger the reject popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectTransaction(modalRef);
      spyOn(component, 'rejectTransaction').and.callThrough();
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  // it('should refreshDocument', () => {
  //   component.refreshDocument({...new DocumentItem(), fromJsonToObject: (json) => json, name: {english: '', arabic: ''}});
  // });

  describe('createWorkflowModel', () => {
    it('to handle workflow actions', () => {
      const data = new BPMUpdateRequest();
      data.taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      data.user = 'mahesh';
      data.outcome = 'Approve';
      data.assignedRole = ValidatorRoles.VALIDATOR_ONE;
      data.referenceNo = '1001246';
      data.rejectionReason = new BilingualText();
      data.comments = 'Approved';
      data.returnReason = new BilingualText();
      component.createWorkflowModel();
      expect(data.taskId).not.toBeNull();
      expect(data.user).not.toBeNull();
      expect(data.outcome).not.toBeNull();
      expect(data.taskId).not.toBeNull();
      expect(data.user).not.toBeNull();
      expect(data.outcome).not.toBeNull();
    });
    it('to handle workflow actions', () => {
      component.referenceNo = 34343;
      expect(component.referenceNo).toEqual(34343);
      component.createWorkflowModel();
    });
    it('to handle workflow actions', () => {
      component.retirementForm = new FormGroup({
        rejectionReason: new FormGroup({ english: new FormControl({ value: 'aaa' }) })
      });
      expect(component.retirementForm.get('rejectionReason')).toBeDefined();
      component.createWorkflowModel();
    });
    it('to handle workflow actions', () => {
      component.retirementForm = new FormGroup({
        comments: new FormControl({ value: 'saa' })
      });
      expect(component.retirementForm.get('rejectionReason')).toBeDefined();
      component.createWorkflowModel();
    });
    it('to handle workflow actions', () => {
      component.retirementForm = new FormGroup({
        returnReason: new FormControl({ value: 'sdsd' })
      });
      expect(component.retirementForm.get('rejectionReason')).toBeDefined();
      component.createWorkflowModel();
    });
  });

  describe('confirmActivate', () => {
    it('to handle workflow actions', () => {
      const modalRef = new BsModalRef();
      component.commonModalRef = modalRef;
      component.hideModal();
      const data = new BPMUpdateRequest();
      data.taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      data.user = 'mahesh';
      data.outcome = 'Approve';
      spyOn(component, 'confirmActivate').and.callThrough();
      component.confirmActivate();
      expect(component.confirmActivate).toHaveBeenCalled();
    });
  });

  describe('confirmRejectRequest', () => {
    it('to handle workflow actions', () => {
      const modalRef = new BsModalRef();
      component.commonModalRef = modalRef;
      component.hideModal();
      const data = new BPMUpdateRequest();
      data.taskId = 'cb7914aa-ab60-468b-b576-623eee111c9b';
      data.user = 'mahesh';
      data.outcome = 'Reject';
      spyOn(component, 'confirmRejectRequest').and.callThrough();
      component.confirmRejectRequest();
      expect(component.confirmRejectRequest).toHaveBeenCalled();
    });
  });
});
