/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */import { HttpClientTestingModule } from '@angular/common/http/testing';
 import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
 import { async, ComponentFixture, TestBed } from '@angular/core/testing';
 import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { BrowserModule } from '@angular/platform-browser';
 import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
 import { RouterModule } from '@angular/router';
 import { RouterTestingModule } from '@angular/router/testing';
 import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, bindToObject, Contributor, DocumentService, LanguageToken, RouterData, RouterDataToken, TransactionService } from '@gosi-ui/core';
 import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
 import { TranslateModule } from '@ngx-translate/core';
 import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
 import { TabsetComponent } from 'ngx-bootstrap/tabs';
 import {  BehaviorSubject, of, throwError } from 'rxjs';
 import {
   AlertServiceStub,
   ComplicationMockService,
   DocumentServiceStub,
   finalSubmitInjury,
   Form,
   genericErrorOh,
   injuryDetailsTestData,
   InjuryMockService,
   ModalServiceStub,
   OhMockService,
   personalDetailsTestData,
   personDetailsTestData,
   reopenReason,
   reopenReasonOthers,
   searchTestData,
   TransactionServiceStub
 } from 'testing';
 import { ProgressWizardDcMockComponent, TabsMockComponent } from 'testing/mock-components';
 import { ComplicationService, InjuryService, OhService, ProcessType } from '../../shared';
 
 import { AddGroupInjuryScComponent } from './add-group-injury-sc.component';
 
 describe('AddGroupInjuryScComponent', () => {
   let component: AddGroupInjuryScComponent;
   let fixture: ComponentFixture<AddGroupInjuryScComponent>;
 
   beforeEach(async(() => {
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
       declarations: [AddGroupInjuryScComponent, ProgressWizardDcMockComponent, TabsMockComponent],
       providers: [
         {
           provide: ProgressWizardDcComponent,
           useClass: ProgressWizardDcMockComponent
         },
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
     }).compileComponents();
   }));
 
   beforeEach(() => {
     TestBed.configureTestingModule({
       declarations: [AddGroupInjuryScComponent]
     }).compileComponents();
     fixture = TestBed.createComponent(AddGroupInjuryScComponent);
     component = fixture.componentInstance;
   });
 
   it('should create', () => {
     expect(component).toBeTruthy();
   });
   describe('saveGroupInjury', () => {
     it('should saveGroupInjury', () => {
       component.currentTab = 2;
       component.totalTabs = 2;
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.saveGroupInjury(personalDetailsTestData);
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
       component.reportOHWizard = new ProgressWizardDcComponent();
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
         '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
       component.reportOHWizard = new ProgressWizardDcComponent();
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
         '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.ngOnInit();
       expect(component.cityList$).not.toBe(null);
     });
   });
   describe('showMandatoryDocErrorMessage', () => {
     it('should showMandatoryDocErrorMessage', () => {
       component.showMandatoryDocErrorMessage(true);
       expect(component.uploadFailed).toBe(true);
     });
   });
   describe('saveGroupInjury', () => {
     it('saveGroupInjury should throw error', () => {
       spyOn(component.groupInjuryService, 'updateContributorDetails').and.returnValue(throwError(genericErrorOh));
       spyOn(component, 'showError').and.callThrough();
       component.saveGroupInjury(personalDetailsTestData);
       expect(component.showError).toHaveBeenCalled();
     });
   });
   describe('showFormValidation', () => {
     it('should show Form Validation', () => {
       component.currentTab = 2;
       component.totalTabs = 2;
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.showFormValidation();
       expect(component.alertService.getAlerts()).not.toBeNull();
     });
   });
   describe('showFormValidation', () => {
     it('should clear alerts', () => {
       component.currentTab = 2;
       component.totalTabs = 2;
       (component as any).appToken = ApplicationTypeEnum.PUBLIC;
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.showFormValidation();
       expect(component.alertService.clearAlerts()).not.toBeNull();
     });
   });
   describe('test suite for previousForm', () => {
     it('It should navigate to previous section', () => {
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.previousForm();
       expect(component.currentTab).toEqual(-1);
     });
   });
   describe('selectWizard', () => {
     it('should selectWizard', () => {
       component.currentTab = 2;
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.selectWizard(1);
       expect(component.currentTab).not.toBe(null);
     });
   });
   describe('setModifyIndicator', () => {
     it('should setModifyIndicator', () => {
       component.currentTab = 2;
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.setModifyIndicator(false);
       expect(component.modifyIndicator).not.toBe(null);
     });
   });
   describe('setReopenReasonOthers', () => {
     it('should setReopenReason', () => {
       component.currentTab = 2;
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.setReopenReason(reopenReasonOthers.reason);
       expect(component.isSelectedReasonOthers).toEqual(true);
     });
   });
   describe('setReopenReason', () => {
     it('should setReopenReason', () => {
       component.currentTab = 2;
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.setReopenReason(reopenReason.reason);
       expect(component.isSelectedReasonOthers).toEqual(false);
     });
   });
   describe('getInjuryReason', () => {
     it('should getInjuryReason', () => {
       component.currentTab = 2;
       component.totalTabs = 2;
       component.reportOHWizard = new ProgressWizardDcComponent();
      //  component.getInjuryReason('');
       expect(component.injuryReasonList$).not.toBe(null);
     });
   });
   describe('saveInjuryDetails', () => {
     it('should saveInjuryDetails', () => {
       component.currentTab = 2;
       component.totalTabs = 2;
       component.isAppPrivate = true;
       spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
       component['routerData'].taskId = '1213';
       component['routerData'].assignedRole = 'estadmin';
       component['routerData'].payload =
         '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
       const groupInjuryForm = new Form();
       component.reportGroupInjuryMainForm = groupInjuryForm.createInjuryForm();
       component.reportGroupInjuryMainForm.addControl('reportInjury', new FormControl('Test'));
       component.reportOHWizard = new ProgressWizardDcComponent();
       component.saveGroupInjuryDetails(injuryDetailsTestData.injuryDetailsDto);
       expect(component.reportedGroupInjuryInformation).not.toBe(null);
     });
     describe('saveInjuryDetails', () => {
       it('should saveInjuryDetails', () => {
         component.currentTab = 2;
         component.totalTabs = 2;
         const injuryForm = new Form();
         component.reportGroupInjuryMainForm = injuryForm.createInjuryForm();
         component.reportGroupInjuryMainForm.addControl('reportGroupInjury', new FormControl('Test'));
         spyOnProperty(component.router, 'url', 'get').and.returnValue('/modify');
         component['routerData'].taskId = null;
 
         component.reportOHWizard = new ProgressWizardDcComponent();
         component.saveGroupInjuryDetails(injuryDetailsTestData.injuryDetailsDto);
         expect(component.reportedGroupInjuryInformation).not.toBe(null);
       });
       it('should saveInjuryDetails', () => {
         component.currentTab = 2;
         component.totalTabs = 2;
         const injuryForm = new Form();
         component.reportGroupInjuryMainForm = injuryForm.createInjuryForm();
         component.reportGroupInjuryMainForm.addControl('reportInjury', new FormControl('Test'));
         spyOnProperty(component.router, 'url', 'get').and.returnValue('/reopen');
         component['routerData'].taskId = null;
 
         component.reportOHWizard = new ProgressWizardDcComponent();
         component.saveGroupInjuryDetails(injuryDetailsTestData.injuryDetailsDto);
         expect(component.reportedGroupInjuryInformation).not.toBe(null);
       });
       it('should saveInjuryDetails', () => {
         component.currentTab = 2;
         component.totalTabs = 2;
         const injuryForm = new Form();
         component.reportGroupInjuryMainForm = injuryForm.createInjuryForm();
         component.reportGroupInjuryMainForm.addControl('reportGroupInjury', new FormControl('Test'));
         spyOnProperty(component.router, 'url', 'get').and.returnValue('/reopen');
         component['routerData'].taskId = '1213';
         component['routerData'].assignedRole = 'estadmin';
         component['routerData'].payload =
           '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
 
         component.reportOHWizard = new ProgressWizardDcComponent();
         component.saveGroupInjuryDetails(injuryDetailsTestData.injuryDetailsDto);
         expect(component.reportedGroupInjuryInformation).not.toBe(null);
       });
       it('should saveInjuryDetails', () => {
         component.currentTab = 2;
         component.totalTabs = 2;
         const injuryForm = new Form();
         component.reportGroupInjuryMainForm = injuryForm.createInjuryForm();
         component.reportGroupInjuryMainForm.addControl('reportGroupInjury', new FormControl('Test'));
         component.injuryId = 1002318957;
         component.reportOHWizard = new ProgressWizardDcComponent();
         component.saveGroupInjuryDetails(injuryDetailsTestData.injuryDetailsDto);
         expect(component.reportedGroupInjuryInformation).not.toBe(null);
       });
       it('saveInjuryDetails should throw error', () => {
         spyOn(component.injuryService, 'reportInjuryService').and.returnValue(throwError(genericErrorOh));
         component.saveGroupInjuryDetails(injuryDetailsTestData.injuryDetailsDto);
         expect(component.reportedGroupInjuryInformation).not.toBe(null);
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
           '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
 
         component.reportOHWizard = new ProgressWizardDcComponent();
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
           '[{"socialInsuranceNo":"601336235","resource":"Injury","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
 
         component.reportOHWizard = new ProgressWizardDcComponent();
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
         component.reportOHWizard = new ProgressWizardDcComponent();
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
         component.reportOHWizard = new ProgressWizardDcComponent();
         component.submitDocument(finalSubmitInjury.comments);
         component.nextForm();
         expect(component.feedbackdetails).not.toBe(null);
       });
     });
     describe('getInjuryStatistics', () => {
       it('should getInjuryStatistics', () => {
         component.currentTab = 2;
         component.totalTabs = 2;
         component.getInjuryStatistics();
         expect(component.injuryStatistics).not.toBe(null);
       });
     });
     describe('getInjuryStatistics', () => {
       it('getInjuryStatistics should throw error', () => {
         spyOn(component.injuryService, 'getInjuryStatistics').and.returnValue(throwError(genericErrorOh));
         spyOn(component, 'showError').and.callThrough();
         component.getInjuryStatistics();
         expect(component.showError).toHaveBeenCalled();
       });
     });
     describe('getManageInjuryDocumentList', () => {
       it('should get manage injury document list', () => {
         component.getManageGroupInjuryDocumentList();
         expect(component.groupInjuryDocumentList$).not.toBe(null);
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
     describe('getInjuryDetails', () => {
       it('should getInjuryDetails', () => {
         component.registrationNo = 1000002;
         component.socialInsuranceNo = 601336235;
         component.injuryId = 10091564134;
         component.isEdit = true;
         component.processType = ProcessType.MODIFY;
        //  spyOn(component.injuryService, 'getInjuryDetails').and.returnValue(of(injuryDetailsTestData));
         spyOn(component, 'getGroupInjuryDetails');
         component.getGroupInjuryDetails();
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
     describe('clearModal', () => {
       it('should clearModal', () => {
         component.modalRef = new BsModalRef();
         spyOn(component.modalRef, 'hide');
         component.clearModal();
         expect(component.modalRef.hide).toHaveBeenCalled();
       });
     });
 
   });
 });
 
