/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  StorageService,
  bindToObject,
  MobileDetails
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  complicationDetailsTestData,
  ComplicationMockService,
  contributorsTestData,
  CoreContributorSerivceStub,
  docItem,
  DocumentServiceStub,
  genericErrorOh,
  injuryHistoryTestData,
  InjuryMockService,
  LookupServiceStub,
  ModalServiceStub,
  OhMockService,
  personDetailsTestData,
  ProgressWizardDcMockComponent,
  StorageServiceStub,
  TabsMockComponent,
  transactionReferenceData,
  injuryHistory,
  contributorSearchTestData,
  personalDetailsTestData,
  injuryHistoryResponseTestData,
  searchTestData,
  initializeTheViewDoctor,
  injuryDetailsTestData
} from 'testing';
import { AddComplicationScComponent } from '..';
import { Complication, InjuryHistoryResponse, Contributor } from '../../shared/models';
import { ComplicationService, InjuryService, OhService } from '../../shared/services';
import { ProcessType, RouteConstants } from '../../shared';

describe('AddComplicationScComponent', () => {
  let component: AddComplicationScComponent;
  let fixture: ComponentFixture<AddComplicationScComponent>;
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

      declarations: [AddComplicationScComponent, ProgressWizardDcMockComponent, TabsMockComponent],
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
        { provide: ApplicationTypeToken, useValue: 'private' },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: OhService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AddComplicationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  let activatedRoute: ActivatedRouteStub;
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.setParamMap({
    id: contributorsTestData.registrationNo,
    taskId: contributorsTestData.taskId,
    validator: contributorsTestData.searchValue
  });
  activatedRoute.setQueryParams({ isReportView: true });

  describe('nextForm', () => {
    it('should fetch next form', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.nextForm();
      expect(component.currentTab).not.toBe(null);
    });
  });
  describe('ngOnit', () => {
    it('should saveInjury', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component['routerData'].taskId = null;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });
  describe('getInjuryList', () => {
    it('to get InjuryList', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component.ohService, 'getOhHistory').and.returnValue(
        of(bindToObject(new InjuryHistoryResponse(), injuryHistoryResponseTestData))
      );
      component.getInjuryList();
      expect(component.injuryList).not.toBe(null);
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
  describe('ngOnit', () => {
    it('should enter condition fo v1 edit', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
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
    it('should enter condition fo v1 edit', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/add');
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
    it('should should enter condition fo estadmin edit', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });
  describe('confirm cancel', () => {
    it('should confirm cancellation', () => {
      component.modalRef = new BsModalRef();
      component.transactionNumber = 12345;
      spyOn(component, 'confirmCancel');
      component.confirmCancel();
      component.isWorkflow = false;
      expect(component.confirmCancel).toHaveBeenCalled();
    });
  });
  describe('confirm cancelInjury', () => {
    it('should confirm cancelInjury', () => {
      spyOn(component.router, 'navigate');
      component.cancelInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([`/home/oh/complication/add`]);
    });
  });
  describe('confirm Navigate to injury view', () => {
    it('should  Navigate to injury view', () => {
      const injuryId = 12334567;
      spyOn(component, 'injuryView');
      spyOn(component.ohService, 'setInjuryId');
      component.injuryView(injuryId);
      expect(component.injuryView).toHaveBeenCalled();
    });
  });
  describe('show cancel template', () => {
    it('should show cancel template', () => {
      spyOn(component.modalService, 'show');
      component.showCancelTemplate();
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('showFormValidation', () => {
    it('should showFormValidation', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component, 'showFormValidation').and.callThrough();
      component.showFormValidation();
      expect(component.showFormValidation).toHaveBeenCalled();
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
  describe('saveAddress', () => {
    it('should saveAddress', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.saveAddress(personDetailsTestData);
      expect(component.saveAddress).not.toBe(null);
    });
  });
  describe('saveAddress', () => {
    it('saveAddress should throw error', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component.ohService, 'updateAddress').and.returnValue(throwError(genericErrorOh));
      component.saveAddress(personDetailsTestData);
      expect(component.error).toBeFalsy();
    });
  });

  describe('saveComplicationDetails', () => {
    it('should saveComplicationDetails', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.isEdit = true;
      component.processType = ProcessType.EDIT;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'estadmin';
      component['routerData'].resourceType = 'Complication';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Complication","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.saveComplication(new Complication().fromJsonToObject(complicationDetailsTestData));
      expect(component.reportedComplicationInformation).not.toBe(null);
    });
  });
  describe('saveComplicationDetails', () => {
    it('should saveComplicationDetails', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.isEdit = true;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = null;
      component.processType = ProcessType.MODIFY;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.saveComplication(new Complication().fromJsonToObject(complicationDetailsTestData));
      expect(component.reportedComplicationInformation).not.toBe(null);
    });
  });
  describe('saveComplicationDetails', () => {
    it('should saveComplicationDetails', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.isEdit = true;
      component['routerData'].taskId = null;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'estadmin';
      component['routerData'].resourceType = 'Injury';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      component.processType = ProcessType.MODIFY;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.saveComplication(new Complication().fromJsonToObject(complicationDetailsTestData));
      expect(component.reportedComplicationInformation).not.toBe(null);
    });
  });
  describe('viewInjury', () => {
    it('should not navigate to add complication', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.viewInjury(injuryHistoryTestData);
      expect(component.viewInjury).not.toBe(null);
    });
  });
  describe('viewInjury', () => {
    it('should view injury details', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      injuryHistoryTestData.addComplicationAllowed = true;
      component.viewInjury(injuryHistoryTestData);
      expect(component.viewInjury).not.toBe(null);
    });
  });

  describe('requestHandler', () => {
    it('should get the Injury list', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component.ohService, 'getOhHistory');
      expect(component.ohService.getOhHistory).not.toBe(null);
    });
  });

  describe('submitDocument', () => {
    it('should submitDocument', () => {
      spyOn(component.router, 'navigate');
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].taskId = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.submitDocument(1001951763, 1001951763, false, transactionReferenceData.comments);
      expect(component.feedbackdetails).not.toBe(null);
    });
  });
  describe('ngOnit', () => {
    it('should enter the conditions for v1 edit ', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
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
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].assignedRole = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.ngOnInit();
      expect(component.cityList$).not.toBe(null);
    });
  });
  describe('submitDocument', () => {
    it('should submitDocument', () => {
      spyOn(component.router, 'navigate');
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = '1213';
      component['routerData'].taskId = 'estadmin';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';

      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.submitComplicationDocuments(transactionReferenceData.comments);
      expect(component.feedbackdetails).not.toBe(null);
    });
  });
  describe('submitDocument', () => {
    it('should submitDocument', () => {
      spyOn(component.router, 'navigate');
      component.currentTab = 0;
      component.totalTabs = 2;
      spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
      component['routerData'].taskId = null;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.submitComplicationDocuments(transactionReferenceData.comments);
      expect(component.feedbackdetails).not.toBe(null);
    });
  });
  describe('showMandatoryDocErrorMessage', () => {
    it('should showMandatoryDocErrorMessage', () => {
      component.uploadFailed = true;
      spyOn(component.alertService, 'showErrorByKey');
      component.showMandatoryDocErrorMessage(true);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
  });

  describe('getComplicationDetails', () => {
    it('getComplicationDetails should throw error', () => {
      spyOn(component.complicationService, 'getComplication').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getComplicationDetails(10000602, 889025956, 1001951763, 1001951763);
      expect(component.showError).toHaveBeenCalled();
    });
  });

  describe('submitDocument', () => {
    it('submitDocument should throw error', () => {
      spyOn(component.router, 'navigate');
      component.currentTab = 0;
      component.totalTabs = 2;
      component['routerData'].taskId = null;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component.complicationService, 'submitComplication').and.returnValue(throwError(genericErrorOh));
      component.complicationService.submitComplication(
        contributorsTestData.injuryId,
        contributorsTestData.complicationId,
        transactionReferenceData.comments,
        false
      );
      expect(component.error).toBeFalsy();
    });
  });
  describe('getWizardItems', () => {
    it('should get wizard items', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      component.getWizardItems();
      expect(component.reportComplicationWizardItems).not.toBe(null);
    });
  });
  describe('getManageInjuryDocumentList', () => {
    it('should get manage injury document list', () => {
      component.getManageInjuryDocumentList();
      expect(component.complicationDocumentList$).not.toBe(null);
    });
  });
  describe('loadMore', () => {
    it('should load more', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component, 'requestHandler').and.callThrough();
      component.onLoadMore(5);
      expect(component.requestHandler).toHaveBeenCalled();
    });
  });

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

  describe('viewInjuryDetails', () => {
    it('should navigate to injury details page', () => {
      component.socialInsuranceNo = 601336235;
      spyOn(component.router, 'navigate');
      component.viewInjuryDetails(injuryHistory);
      spyOn(component.ohService, 'setInjuryId');
      expect(component.router.navigate).toHaveBeenCalledWith([
        'home/oh/view/10000602/601336235/1002318957/injury/info'
      ]);
    });
  });
  describe('getInjuryDetails', () => {
    it('should getInjuryDetails', () => {
      component.routerData == initializeTheViewDoctor;
      component.registrationNo = 1000002;
      component.socialInsuranceNo = 601336235;
      component.injuryId = 10091564134;
      // spyOn(component.injuryService, 'getInjuryDetails').and.returnValue(of(injuryDetailsTestData));
      spyOn(component, 'getInjuryDetails');
      component.getInjuryDetails();
      expect(component.injuryDetailsWrapper).not.toBe(null);
    });
  });

  describe('getContributor', () => {
    it('should getContributor', () => {
      component.getContributor();
      expect(component.contributor).not.toBe(null);
    });
  });
  describe('getContributor', () => {
    it('should getContributor', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      spyOn(component.contributorService, 'getContributor').and.returnValue(
        of(bindToObject(new Contributor(), searchTestData))
      );
      component.getContributorDetails(true, 10000602, 601336235);
      expect(component.personalDetails).not.toBe(null);
    });
  });
  describe('getInjuryList', () => {
    it('should getInjuryList', () => {
      component.registrationNo = 2342356;
      expect(component.ohService.getRegistrationNumber).not.toBe(null);
    });
  });
  /*describe('cancelInjury', () => {
    it('should cancelInjury', () => {
      component.currentTab = 2;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component, 'cancelInjury').and.callThrough();
      component.cancelInjury();
      expect(component.cancelInjury).toHaveBeenCalled();
    });
  });*/
  describe('getInjuryList', () => {
    it('getInjuryList should throw error', () => {
      component.currentTab = 0;
      component.totalTabs = 2;
      component.reportComplicationWizard = new ProgressWizardDcComponent();
      spyOn(component.ohService, 'getOhHistory').and.returnValue(throwError(genericErrorOh));
      component.getInjuryList();
      expect(component.error).toBeFalsy();
    });
  });
  describe('getCompanionDetails', () => {
    it('getCompanionDetails should throw error', () => {
      spyOn(component.contributorService, 'getContributor').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getContributor();
      expect(component.showError).toHaveBeenCalled();
    });
  });
});
