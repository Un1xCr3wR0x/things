/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  BilingualText,
  bindToObject,
  DocumentItem,
  LookupService,
  RouterConstants,
  TransactionFeedback
} from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import {
  ChangeGroupEstablishmentStubService,
  documentItem,
  documentResponseItemList,
  flagDetails,
  flagDetailsMock,
  FlagEstablishmentStubService,
  genericError,
  genericEstablishmentResponse,
  LookupServiceStub
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import { activatedRouteStub } from '../../../profile/components/establishment-group-profile-sc/establishment-group-profile-sc.component.spec';
import { searchEstablishmentResponse } from '../../../register-proactive/components/register-proactive-sc/test-data';
import { ChangeGroupEstablishmentService, FlagEstablishmentService } from '../../../shared';
import { AddFlagScComponent } from './add-flag-sc.component';

describe('AddFlagScComponent', () => {
  let component: AddFlagScComponent;
  let fixture: ComponentFixture<AddFlagScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFlagScComponent],
      providers: [
        ...commonProviders,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        {
          provide: FlagEstablishmentService,
          useClass: FlagEstablishmentStubService
        },
        { provide: ChangeGroupEstablishmentService, useClass: ChangeGroupEstablishmentStubService }
      ],
      imports: [...commonImports, RouterModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFlagScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ng On init', () => {
    it('should initialise component', () => {
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_FLAG_ESTABLISHMENT;
      component.estRouterData.taskId = 'abcd';
      component.flagService.registrationNo = undefined;
      component.flagForm = component.createAddFlagForm();
      spyOn(component, 'initialiseTabWizards').and.callThrough();
      component.ngOnInit();
      expect(component.flagForm).not.toBe(null);
      expect(component.initialiseTabWizards).toHaveBeenCalled();
    });
    it('should initilaise component with selectedregNo', () => {
      (component as any).estRouterData.taskId = undefined;
      component.flagService.registrationNo = genericEstablishmentResponse.registrationNo;
      spyOn(component, 'getEstablishmentDetails').and.callThrough();
      component.ngOnInit();
      expect(component.getEstablishmentDetails).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      spyOn(component, 'hideModal');
      spyOn(component, 'cancelTransaction');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
      expect(component.cancelTransaction).toHaveBeenCalled();
    });
  });
  describe('initialiseTabWizards', () => {
    it('should initialiseTabWizards', () => {
      const currentTab = 0;
      component.initialiseTabWizards(currentTab);
      expect(component.flagWizards).not.toBe(null);
    });
  });
  describe('select wizard', () => {
    it('should select wizard', () => {
      const tabIndex = 1;
      const restrictNextWizards = false;
      component.selectedWizard(tabIndex, restrictNextWizards);
      expect(component.flagWizards).not.toBe(null);
    });
  });
  describe('getDocuments', () => {
    it('should get documents', () => {
      component.flagForm = component.createAddFlagForm();
      component.getDocuments();
      expect(component.flagDocuments).not.toBeNull();
    });
  });

  describe('getEstablishmentDetails', () => {
    it('should call getEstablishmentDetails', fakeAsync(() => {
      component.registrationNo = 200085744;
      component.establishment = genericEstablishmentResponse;
      component.establishment.molEstablishmentIds = searchEstablishmentResponse.molEstablishmentIds;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(genericEstablishmentResponse));

      component.getEstablishmentDetails(component.registrationNo);
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
      expect(component.establishment).toBeDefined();
    }));
    it('should call getEstablishmentDetails with error', () => {
      component.registrationNo = 200085744;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getEstablishmentDetails(component.registrationNo);
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('refresh document content', () => {
    it('should refresh document content', () => {
      const document = new DocumentItem();
      const documentType = 'iqama';
      const identifier = 12345;
      spyOn(component.documentService, 'refreshDocument').and.returnValue(of(documentItem));
      component.refreshDocumentContent(document, identifier, documentType);
      expect(component.documentService.refreshDocument).toHaveBeenCalled();
    });
  });
  describe('submitFlagDetails', () => {
    it('should submit transaction mandatory error', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.isValidator = true;
      component.flagForm = component.createAddFlagForm();
      const isFinalSubmit = false;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.submitFlagDetails(isFinalSubmit);
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });

    it('should submit transaction ', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('flagType').get('english').setValue('test');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('endDate').get('gregorian').setValue(new Date('2007-05-01T00:00:00.000Z'));
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('startDate').get('gregorian').setValue(new Date());
      const isFinalSubmit = true;
      component.isValidator = true;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.alertService, 'showError');
      spyOn(component, 'updateBpm');
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(of([flagDetailsMock]));
      spyOn(component.flagService, 'saveFlagDetails').and.returnValue(of(new TransactionFeedback()));

      component.submitFlagDetails(isFinalSubmit);
      expect(component.flagService.saveFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should throw during document error', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('flagType').get('english').setValue('test');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('startDate').get('gregorian').setValue(new Date());
      const isFinalSubmit = true;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(false);
      spyOn(component.alertService, 'showMandatoryDocumentsError');
      component.submitFlagDetails(isFinalSubmit);
      expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
    });
  });

  describe('cancel  transaction', () => {
    it('should cancel the transaction for validator flow', () => {
      component.referenceNo = 123;
      component.registrationNo = 123;
      component.isValidator = true;
      spyOn(component.changeEstablishmentService, 'cancelTransaction').and.returnValue(of(null));
      component.cancelTransaction();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
    it('should cancel the transaction', () => {
      component.referenceNo = 123;
      component.registrationNo = 123;
      component.isValidator = false;
      spyOn(component.location, 'back');
      spyOn(component.changeEstablishmentService, 'cancelTransaction').and.returnValue(of(null));
      component.cancelTransaction();
      expect(component.location.back).toHaveBeenCalled();
    });
    it('should cancel the transaction that throws error', () => {
      component.referenceNo = 123;
      component.registrationNo = 123;
      component.isValidator = false;
      spyOn(component.alertService, 'showError');
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(throwError(genericError));
      component.cancelTransaction();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should cancel the transaction and navigate to profile', () => {
      component.referenceNo = null;
      component.registrationNo = 200085744;
      component.establishment = genericEstablishmentResponse;
      spyOn(component.changeEstablishmentService, 'navigateToProfile');
      component.cancelTransaction();
      expect(component.changeEstablishmentService.navigateToProfile).toHaveBeenCalled();
    });
  });
  describe('getFlagDetails', () => {
    it('should call getFlagDetails', () => {
      component.registrationNo = 200085744;
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(of([flagDetailsMock]));
      component.getFlagDetails();
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.flagDetails).toBeDefined();
    });
    it('should call getFlagDetails with error', () => {
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getFlagDetails();
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('submitFlagDetails', () => {
    it('should submit flag details', () => {
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('referenceNo').setValue(genericEstablishmentResponse.registrationNo);
      component.flagForm.get('flagType').get('english').setValue('Allow HRSD Services');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('startDate').get('gregorian').setValue(new Date('2007-05-01T00:00:00.000Z'));
      component.flagForm.get('endDate').get('gregorian').setValue(new Date('2007-06-01T00:00:00.000Z'));
      component.flagDetails = [flagDetails];
      component.showWarning = true;
      //spyOn(component.changeEstablishmentService, 'cancelTransaction').and.returnValue(of(null));
      spyOn(component.alertService, 'showWarningByKey');
      component.checkDateValidation();
      //expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
      expect(component.alertService.showWarningByKey).toHaveBeenCalled();
    });
  });
  describe('update bpm', () => {
    it('should update bpm', () => {
      component.estRouterData.taskId = '1561651';
      component.estRouterData.user = 'abcd';
      component.transactionFeedback = new TransactionFeedback();
      const bilingualResponse = new BilingualText();
      component.transactionFeedback.successMessage = bilingualResponse;
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.workflowService, 'updateTaskWorkflow').and.returnValue(of(bilingualResponse));
      component.updateBpm(component.estRouterData, 'comments', bilingualResponse).subscribe(() => {
        expect(component.alertService.showSuccess).toHaveBeenCalled();
      });
    });
  });
});
