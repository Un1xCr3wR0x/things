/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  CoreContributorService,
  DocumentItem,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  StorageService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ComplicationMockService,
  CoreContributorSerivceStub,
  docItem,
  DocumentServiceStub,
  genericErrorOh,
  InjuryMockService,
  LookupServiceStub,
  ModalServiceStub,
  OhMockService,
  ProgressWizardDcMockComponent,
  StorageServiceStub,
  TabsMockComponent,
  transactionReferenceData,
  ReopenReasonLov,
  ReopenReason,
  complicationDetailsTestData,
  ComplicationForms,
  Form
} from 'testing';
import { ReopenComplicationScComponent } from '..';
import { ComplicationService, InjuryService, OhService } from '../../shared/services';
import { Complication, RouteConstants } from '../../shared';

describe('ReopenComplicationScComponent', () => {
  let component: ReopenComplicationScComponent;
  let fixture: ComponentFixture<ReopenComplicationScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserDynamicTestingModule,
        RouterModule.forRoot([])
      ],

      declarations: [ReopenComplicationScComponent, ProgressWizardDcMockComponent, TabsMockComponent],
      providers: [
        {
          provide: ProgressWizardDcComponent,
          useClass: ProgressWizardDcMockComponent
        },
        { provide: TabsetComponent, useClass: TabsMockComponent },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: CoreContributorService, useClass: CoreContributorSerivceStub },
        { provide: StorageService, useClass: StorageServiceStub },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'Private' },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: OhService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenComplicationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterAll(() => {
    TestBed.resetTestingModule();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('nextForm', () => {
    it('should fetch next form', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.initializeWizardItems();
      expect(component.reopenWizardItems).not.toBe(null);
    });
  });
  describe('ngOnit', () => {
    it('should enter the conditions for v1 edit ', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/re-open');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'Validator1';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });
  describe('ngOnit', () => {
    it('should enter the conditions for estadmin edit ', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/re-open');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });
  describe('ngOnit', () => {
    it('should saveInjury', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });
  describe('selectWizard', () => {
    it('should selectWizard', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.selectWizard(0);
      expect(component.currentTab).not.toBeNull();
    });
  });
  describe('test suite for previousForm', () => {
    it('It should navigate to previous section', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.previousForm();
      expect(component.currentTab).toEqual(-1);
    });
  });

  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component, 'refreshDocument').and.callThrough();
      component.refreshDocument(new DocumentItem().fromJsonToObject(docItem));
      expect(component.refreshDocument).toHaveBeenCalled();
    });
  });

  describe('submitDocument', () => {
    it('submitDocument should throw error', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.showMandatoryDocErrorMessage(false);
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component.complicationService, 'submitComplication').and.returnValue(throwError(genericErrorOh));
      component.submitDocuments(transactionReferenceData.comments);
      expect(component.error).toBeFalsy();
    });
  });
  describe('submitDocument', () => {
    it('should submitDocument', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/re-open');
      component['routerData'].taskId = '1213';
      component['routerData'].taskId = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.submitDocuments(transactionReferenceData.comments);
      expect(component.feedbackdetails).not.toBe(null);
    });
  });
  /* describe('submitDocument', () => {
    it('should submitDocument', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/re-open');
      component['routerData'].taskId = null;
      const documentForm = new Form();
      component.documentForm = documentForm.createUploadForm();
      component.documentForm.addControl('uploadDocument', new FormControl('Test'));
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.submitDocuments(transactionReferenceData.comments);
      expect(component.feedbackdetails).not.toBe(null);
    });
  });*/

  /*describe('confirmCancel', () => {
    it('should confirm cancel', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });*/
  describe('decline', () => {
    it('should decline', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.modalRef = new BsModalRef();
      component.decline();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('getComplication', () => {
    it('should getComplication', () => {
      component.getComplicationDetails(10000602, 889025956, 1001951763, 1001951763);
      expect(component.complicationDetails).not.toBe(null);
    });
  });

  describe('getComplication for reopen scenario', () => {
    it('should getComplication', () => {
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/re-open');
      component['routerData'].taskId = '1213';
      component['routerData'].taskId = 'Validator1';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.getComplicationDetails(10000602, 889025956, 1001951763, 1001951763);
      expect(component.complicationDetails).not.toBe(null);
    });
  });
  describe('getComplicationDetails', () => {
    it('getComplicationDetails should throw error', () => {
      spyOn(component, 'showError').and.callThrough();
      spyOn(component.complicationService, 'getComplication').and.returnValue(throwError(genericErrorOh));

      component.getComplicationDetails(10000602, 889025956, 1001951763, 1001951763);
      expect(component.showError).toHaveBeenCalled();
    });
  });

  describe('viewInjuryDetails', () => {
    it('should navigate to injury details page', () => {
      spyOn(component.ohService, 'setInjuryId');
      expect(component.ohService.getInjuryId()).not.toBe(null);
    });
  });
  describe('modifyComplication', () => {
    it('should navigate to modifyComplication', () => {
      component.modifyComplication(true);
      expect(component.modifyIndicator).toBe(true);
    });
  });
  describe('getContributor', () => {
    it('should getContributor', () => {
      component.getContributor();
      expect(component.getContributor).not.toBe(false);
    });
  });
  describe('showMandatoryDocErrorMessage', () => {
    it('should showMandatoryDocErrorMessage', () => {
      component.showMandatoryDocErrorMessage(true);
      expect(component.uploadFailed).toBe(true);
    });
  });
  describe('showFormValidation', () => {
    it('should showFormValidation', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.showFormValidation();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('selectedReason', () => {
    it('should selectedReason', () => {
      component.selectedReason(ReopenReasonLov);
      expect(component.isSelectedReasonOthers).toBe(true);
    });
  });
  describe('selectedReason', () => {
    it('should selectedReason', () => {
      component.selectedReason(ReopenReason);
      expect(component.isSelectedReasonOthers).toBe(false);
    });
  });
  describe('showToggle', () => {
    it('should showToggle', () => {
      component.showToggle(false);
      expect(component.modifyIndicator).toBe(true);
    });
  });
  describe('cancelInjury', () => {
    it('should cancelInjury', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      spyOn(component.router, 'navigate');
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component, 'cancelComplication').and.callThrough();
      component.cancelComplication();
      expect(component.router.navigate).toHaveBeenCalledWith([RouteConstants.ROUTE_COMPLICATION]);
    });
  });
  describe('saveReopenComplicationDetails', () => {
    it('should saveReopenComplicationDetails', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.isEdit = true;
      const form = new ComplicationForms();
      component.reopenComplicationForm = form.createReopenComplicationForm();
      component.reportComplicationMainForm = form.createComplicationForm();
      component.reportComplicationMainForm.addControl('reportComplication', new FormControl('Test'));
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/re-open');
      component['routerData'].taskId = '1213';
      component['routerData'].taskId = 'Validator1';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.saveReopenComplicationDetails(new Complication().fromJsonToObject(complicationDetailsTestData));
      expect(component.reportedComplicationInformation).not.toBe(null);
    });
  });
  describe('saveReopenComplicationDetails', () => {
    it('should saveReopenComplicationDetails', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      const form = new ComplicationForms();
      component.reopenComplicationForm = form.createReopenComplicationForm();
      component.reportComplicationMainForm = form.createComplicationForm();
      component.isEdit = true;
      component.reportComplicationMainForm.addControl('reportComplication', new FormControl('Test'));
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/re-open');
      component['routerData'].taskId = null;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.saveReopenComplicationDetails(new Complication().fromJsonToObject(complicationDetailsTestData));
      expect(component.reportedComplicationInformation).not.toBe(null);
    });
  });
});
