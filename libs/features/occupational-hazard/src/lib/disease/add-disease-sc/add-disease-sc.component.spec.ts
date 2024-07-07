import { async,ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AddDiseaseScComponent } from './add-disease-sc.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  ApplicationTypeEnum,
  bindToObject,
  TransactionService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  AlertServiceStub,
  ComplicationMockService,
  DocumentServiceStub,
  Form,
  InjuryMockService,
  ModalServiceStub,
  OhMockService,
  personalDetailsTestData,
  reopenReason,
  reopenReasonOthers,
  TransactionServiceStub
} from 'testing';
import { ProgressWizardDcMockComponent, TabsMockComponent } from 'testing/mock-components';
import {
  finalSubmitInjury,
  genericErrorOh,
  personDetailsTestData,
  searchTestData,
} from 'testing/test-data/features/occupational-hazard/shared/oh-test-data';
import { ComplicationService, InjuryService, OhService } from '../../shared/services';
import { Contributor, ProcessType } from '../../shared';
import { DiseaseService } from '../../shared/services';

describe('AddDiseaseScComponent', () => {
  let component: AddDiseaseScComponent;
  let fixture: ComponentFixture<AddDiseaseScComponent>;

  beforeEach(async (() => {
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
      declarations: [ AddDiseaseScComponent, ProgressWizardDcMockComponent, TabsMockComponent],
      providers: [
        {
          provide: ProgressWizardDcComponent,
          useClass: ProgressWizardDcMockComponent
        },
        { provide: DiseaseService, useClass: InjuryMockService },
        { provide: TabsetComponent, useClass: TabsMockComponent },
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'Private' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        {
          provide: TransactionService,
          useClass: TransactionServiceStub
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDiseaseScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(AddDiseaseScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('saveDisease', () => {
    it('should saveDisease', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.saveDisease(personalDetailsTestData);
      component.saveAllowancePayee(personDetailsTestData.payeetype);
      expect(component.injuryNumber).not.toBe(null);
    });
  });

  describe('ngOnit', () => {
    it('ngOnit', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component['routerData'].taskId = null;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.socialInsuranceNo = null;
      component.ngOnInit();
      expect(component.person).not.toBe(null);
    });
  });
  describe('ngOnit', () => {
    it('should enter the conditions for v1 edit ', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].tabIndicator = 1;
      component['routerData'].assignedRole = 'Validator1';
      component.processType = ProcessType.REOPEN;
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Disease","registrationNo":"10000602","channel":"field-office","id":"1001926370","diseaseId":"1432556"}]';
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });

  describe('ngOnit', () => {
    it('should enter the conditions for estadmin edit ', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.processType = ProcessType.EDIT;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Disease","registrationNo":"10000602","channel":"field-office","id":"1001926370","diseaseId":"1432556"}]';
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });

  describe('getEngagementDetails', () => {
    it('should getEngagementDetails', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      expect(component.occupation).not.toBe(null);
    });
  });

  describe('showMandatoryDocErrorMessage', () => {
    it('should showMandatoryDocErrorMessage', () => {
      component.showMandatoryDocErrorMessage(true);
      expect(component.uploadFailed).toBe(true);
    });
  });

  describe('getEngagementDetails', () => {
    it('getEngagementDetails should throw error', () => {
      spyOn(component.contributorService, 'getEngagement').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      expect(component.showError).toHaveBeenCalled();
    });
  });

  describe('saveDisease', () => {
    it('saveDisease should throw error', () => {
      spyOn(component.diseaseService, 'saveEmergencyContactDisease').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.saveDisease(personalDetailsTestData);
      expect(component.showError).toHaveBeenCalled();
    });
  });

  describe('showFormValidation', () => {
    it('should show Form Validation', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.showFormValidation();
      expect(component.alertService.getAlerts()).not.toBeNull();
    });
  });

  describe('showFormValidation', () => {
    it('should clear alerts', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      (component as any).appToken = ApplicationTypeEnum.PUBLIC;
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.showFormValidation();
      expect(component.alertService.clearAlerts()).not.toBeNull();
    });
  });

  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.previousForm();
      expect(component.currentTab).toEqual(-1);
    });
  });

  describe('setModifyIndicator', () => {
    it('should setModifyIndicator', () => {
      component.currentTab = 2;
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.setModifyIndicator(false);
      expect(component.modifyIndicator).not.toBe(null);
    });
  });
  describe('setReopenReasonOthers', () => {
    it('should setReopenReason', () => {
      component.currentTab = 2;
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.setReopenReason(reopenReasonOthers.reason);
      expect(component.isSelectedReasonOthers).toEqual(true);
    });
  });
  describe('setReopenReason', () => {
    it('should setReopenReason', () => {
      component.currentTab = 2;
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.setReopenReason(reopenReason.reason);
      expect(component.isSelectedReasonOthers).toEqual(false);
    });
  });

  describe('saveDiseaseDetails', () => {
    it('should saveDiseaseDetails', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.isAppPrivate = true;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Disease","registrationNo":"10000602","channel":"field-office","id":"1001926370","diseaseId":"1432556"}]';
      const diseaseForm = new Form();
      component.reportDiseaseMainForm = diseaseForm.createInjuryForm();
      component.reportDiseaseMainForm.addControl('reportDisease', new FormControl('Test'));
      component.reportDiseaseWizard = new ProgressWizardDcComponent();
      component.saveDiseaseDetails();
      expect(component.reportedDiseaseInformation).not.toBe(null);
    });
    describe('saveDiseaseDetails', () => {
      it('should saveDiseaseDetails', () => {
        component.currentTab = 2;
        component.totalTabs = 2;
        const diseaseForm = new Form();
        component.reportDiseaseMainForm = diseaseForm.createInjuryForm();
        component.reportDiseaseMainForm.addControl('reportDisease', new FormControl('Test'));
        spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
        component['routerData'].taskId = null;

        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.saveDiseaseDetails();
        expect(component.reportedDiseaseInformation).not.toBe(null);
      });
      it('should saveDiseaseDetails', () => {
        component.currentTab = 2;
        component.totalTabs = 2;
        const DiseaseForm = new Form();
        component.reportDiseaseMainForm = DiseaseForm.createInjuryForm();
        component.reportDiseaseMainForm.addControl('reportDisease', new FormControl('Test'));
        spyOnProperty(component.router, 'url', 'get').and.returnValue('/reopen');
        component['routerData'].taskId = null;

        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.saveDiseaseDetails();
        expect(component.reportedDiseaseInformation).not.toBe(null);
      });
      it('should saveDiseaseDetails', () => {
        component.currentTab = 2;
        component.totalTabs = 2;
        const DiseaseForm = new Form();
        component.reportDiseaseMainForm = DiseaseForm.createInjuryForm();
        component.reportDiseaseMainForm.addControl('reportDisease', new FormControl('Test'));
        spyOnProperty(component.router, 'url', 'get').and.returnValue('/reopen');
        component['routerData'].taskId = '1213';
        component['routerData'].assignedRole = 'estadmin';
        component['routerData'].payload =
          '[{"socialInsuranceNo":"601336235","resource":"Disease","registrationNo":"10000602","channel":"field-office","id":"1001926370","diseaseId":"1432556"}]';

        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.saveDiseaseDetails();
        expect(component.reportedDiseaseInformation).not.toBe(null);
      });
      it('should saveDiseaseDetails', () => {
        component.currentTab = 2;
        component.totalTabs = 2;
        const injuryForm = new Form();
        component.reportDiseaseMainForm = injuryForm.createInjuryForm();
        component.reportDiseaseMainForm.addControl('reportDisease', new FormControl('Test'));
        component.injuryId = 1002318957;
        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.saveDiseaseDetails();
        expect(component.reportedDiseaseInformation).not.toBe(null);
      });
      it('saveDiseaseDetails should throw error', () => {
        spyOn(component.diseaseService, 'reportDisease').and.returnValue(throwError(genericErrorOh));
        component.saveDiseaseDetails();
        expect(component.reportedDiseaseInformation).not.toBe(null);
      });
    });
    describe('saveAddress', () => {
      it('should saveAddress', () => {
        component.currentTab = 2;
        component.totalTabs = 2;
        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        spyOn(component, 'nextForm').and.callThrough();
        component.saveAddress(personDetailsTestData);
        expect(component.nextForm).toHaveBeenCalled();
      });
    });
    describe('saveAddress', () => {
      it('saveAddress should throw error', () => {
        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        spyOn(component.ohService, 'updateAddress').and.returnValue(throwError(genericErrorOh));
        spyOn(component, 'showError').and.callThrough();
        component.saveAddress(personDetailsTestData);
        expect(component.showError).toHaveBeenCalled();
      });
    });
    describe('submitDocument', () => {
      it('should submitDocument', () => {
        spyOn(component.router, 'navigate');
        component.currentTab = 2;
        component.totalTabs = 2;
        component.showMandatoryDocErrorMessage(true);
        const documentForm = new Form();
        component.documentForm = documentForm.createUploadForm();
        component.documentForm.addControl('uploadDocument', new FormControl('Test'));
        spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
        component['routerData'].taskId = '1213';
        component['routerData'].taskId = 'estadmin';
        component['routerData'].payload =
          '[{"socialInsuranceNo":"601336235","resource":"Disease","registrationNo":"10000602","channel":"field-office","id":"1001926370","diseaseId":"1432556"}]';

        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.submitDocument(finalSubmitInjury.comments);
        component.nextForm();
        expect(component.feedbackdetails).not.toBe(null);
      });
    });
    describe('submitDocument', () => {
      it('should submitDocument', () => {
        spyOn(component.router, 'navigate');
        component.currentTab = 2;
        component.totalTabs = 2;
        const documentForm = new Form();
        component.documentForm = documentForm.createUploadForm();
        component.documentForm.addControl('uploadDocument', new FormControl('Test'));
        spyOnProperty(component.router, 'url', 'get').and.returnValue('/reopen');
        component['routerData'].taskId = '1213';
        component['routerData'].taskId = 'estadmin';
        component['routerData'].payload =
          '[{"socialInsuranceNo":"601336235","resource":"Disease","registrationNo":"10000602","channel":"field-office","id":"1001926370","diseaseId":"1432556"}]';

        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.submitDocument(finalSubmitInjury.comments);
        component.nextForm();
        expect(component.feedbackdetails).not.toBe(null);
      });
    });
    describe('submitDocument', () => {
      it('should submitDocument', () => {
        spyOn(component.router, 'navigate');
        component.currentTab = 2;
        component.totalTabs = 2;
        const documentForm = new Form();
        component.documentForm = documentForm.createUploadForm();
        component.documentForm.addControl('uploadDocument', new FormControl('Test'));
        spyOnProperty(component.router, 'url', 'get').and.returnValue('/reopen');
        component['routerData'].taskId = null;
        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.submitDocument(finalSubmitInjury.comments);
        component.nextForm();
        expect(component.feedbackdetails).not.toBe(null);
      });
    });
    describe('submitDocument', () => {
      it('should submitDocument', () => {
        spyOn(component.router, 'navigate');
        component.currentTab = 2;
        component.totalTabs = 2;
        const documentForm = new Form();
        component.documentForm = documentForm.createUploadForm();
        component.documentForm.addControl('uploadDocument', new FormControl('Test'));
        spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
        component['routerData'].taskId = null;
        component.reportDiseaseWizard = new ProgressWizardDcComponent();
        component.submitDocument(finalSubmitInjury.comments);
        component.nextForm();
        expect(component.feedbackdetails).not.toBe(null);
      });
    });

    describe('getManageDiseaseDocumentList', () => {
      it('should get manage disease document list', () => {
        component.getManageDiseaseDocumentList();
        expect(component.DiseasedocumentList$).not.toBe(null);
      });
    });
    describe('confirm cancel', () => {
      it('should confirm cancellation', () => {
        component.modalRef = new BsModalRef();
        spyOn(component.router, 'navigate');
        component.confirmCancel();
        component.isWorkflow = false;
        expect(component.modalRef).not.toEqual(null);
      });
    });
    describe('getData', () => {
      it('should getData', () => {
        spyOn(component.router, 'navigate');
        component.complicationId = null;
        component.isAppPrivate = true;
        component.isValidator1 = true;
        spyOn(component.ohService, 'getSocialInsuranceNo');
        component.getData();
        expect(component.socialInsuranceNo).not.toBe(null);
      });
    });
    describe('getDiseaseDetails', () => {
      it('should getDiseaseDetails', () => {
        component.registrationNo = 1000002;
        component.socialInsuranceNo = 601336235;
        component.injuryId = 10091564134;
        component.isEdit = true;
        component.processType = ProcessType.MODIFY;
        spyOn(component.diseaseService, 'getDiseaseDetails').and.returnValue(throwError(genericErrorOh));
        spyOn(component, 'getDiseaseDetails');
        component.getDiseaseDetails();
        expect(component.injuryDetailsWrapper).not.toBe(null);
      });
    });
    it('Should getContributor', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      spyOn(component.contributorService, 'getContributor').and.returnValue(
        of(bindToObject(new Contributor(), searchTestData))
      );
      component.getContributor();
      expect(component.personId).not.toBeNull();
    });
    describe('getContributor', () => {
      it('getContributor should throw error', () => {
        component.registrationNo = 10000602;
        component.socialInsuranceNo = 601336235;
        spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericErrorOh));
        spyOn(component, 'showError').and.callThrough();
        component.getContributor();
        expect(component.showError).toHaveBeenCalled();
      });
    });

    describe('decline', () => {
      it('should hide the modal', () => {
        component.modalRef = new BsModalRef();
        spyOn(component.modalRef, 'hide');
        component.decline();
        expect(component.modalRef.hide).toHaveBeenCalled();
      });
    });
  });


});

