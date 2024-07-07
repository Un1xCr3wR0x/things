import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, RouterModule } from '@angular/router';
import {
  BilingualText,
  bindToObject,
  DocumentItem,
  LookupService,
  RouterConstants,
  TransactionFeedback
} from '@gosi-ui/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { of, throwError } from 'rxjs';
import {
  documentItem,
  documentResponseItemList,
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
import { DocumentTransactionTypeEnum, FlagEstablishmentService } from '../../../shared';
import { ModifyFlagScComponent } from './modify-flag-sc.component';

describe('ModifyFlagScComponent', () => {
  let component: ModifyFlagScComponent;
  let fixture: ComponentFixture<ModifyFlagScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyFlagScComponent],
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
        }
      ],
      imports: [...commonImports, RouterModule.forRoot([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyFlagScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ng On init', () => {
    it('should initialise the view', () => {
      component.estRouterData.resourceType = RouterConstants.TRANSACTION_MODIFY_FLAG_ESTABLISHMENT;
      component.estRouterData.taskId = 'abcd';
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({
          registrationNo: genericEstablishmentResponse.registrationNo,
          referenceNo: 1111
        })
      );
      activatedRouteStub.paramMap.subscribe(params => {
        component.registrationNo = +params.get('registrationNo');
        component.referenceNo = +params.get('referenceNo');
      });

      spyOn(component, 'initialiseTabWizards').and.callThrough();
      spyOn(component, 'getFlags').and.callThrough();
      component.ngOnInit();
      expect(component.initialiseTabWizards).toHaveBeenCalled();
      expect(component.flagForm).not.toBe(null);
      expect(component.getFlags).toHaveBeenCalled();
    });
  });
  describe('cancel Modal', () => {
    it('should cancel popup', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component, 'hideModal');
      component.cancelModal();
      expect(component.hideModal).toHaveBeenCalled();
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
      component.getModifyDocuments();
      expect(component.flagDocuments).not.toBeNull();
    });
    it('should get documents', () => {
      const transactionKey = DocumentTransactionTypeEnum.MODIFY_FLAG_ESTABLISHMENT;
      const transactionType = DocumentTransactionTypeEnum.FLAG_ESTABLISHMENT;
      component.documentTransactionKey = transactionKey;
      component.documentTransactionType = transactionType;
      spyOn(component.changeGrpEstablishmentService, 'getDocuments').and.callThrough();

      component.getModifyDocuments();
      expect(component.flagDocuments).not.toBeNull();

      expect(component.changeGrpEstablishmentService.getDocuments).toHaveBeenCalled();
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
  describe('getFlags', () => {
    it('should call getFlags', () => {
      component.registrationNo = 200085744;
      component.referenceNo = 347897;
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(of([flagDetailsMock]));

      component.getFlags();
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.flags).toBeDefined();
    });
    it('should call getFlags with error', () => {
      component.registrationNo = 200085744;
      component.referenceNo = 347897;
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getFlags();
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('submitFlagDetails', () => {
    it('should submit transaction ', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('flagType').get('english').setValue('test');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('startDate').get('gregorian').setValue(new Date());
      component.flagForm.get('referenceNo').setValue(123445);
      const isFinalSubmit = true;
      component.isValidator = false;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.flagService, 'saveModifiedFlagDetails').and.returnValue(of(new TransactionFeedback()));
      spyOn(component.location, 'back');
      component.submitFlagDetails(isFinalSubmit);
      expect(component.flagService.saveModifiedFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showSuccess).toHaveBeenCalled();
      expect(component.location.back).toHaveBeenCalled();
    });
    it('should submit transaction ', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('flagType').get('english').setValue('test');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('endDate').get('gregorian').setValue(null);
      const isFinalSubmit = true;
      component.isValidator = true;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.flagService, 'saveModifiedFlagDetails').and.returnValue(of(new TransactionFeedback()));
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      spyOn(component, 'updateBpm');
      component.submitFlagDetails(isFinalSubmit);
      expect(component.flagService.saveModifiedFlagDetails).toHaveBeenCalled();
      expect(component.updateBpm).toHaveBeenCalled();
      // expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
    it('should submit transaction ', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('flagType').get('english').setValue('test');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('endDate').get('gregorian').setValue(null);
      const isFinalSubmit = true;
      component.isValidator = true;
      const bilingualResponse = new BilingualText();
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.alertService, 'showSuccess');
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.flagService, 'saveModifiedFlagDetails').and.returnValue(of(new TransactionFeedback()));
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      spyOn(component, 'updateBpm').and.returnValue(of(bilingualResponse));
      component.submitFlagDetails(isFinalSubmit);
      expect(component.flagService.saveModifiedFlagDetails).toHaveBeenCalled();
      expect(component.updateBpm).toHaveBeenCalled();
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
    it('should throw error', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('flagType').get('english').setValue('test');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('endDate').get('gregorian').setValue(null);
      const isFinalSubmit = true;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.alertService, 'showError');
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.flagService, 'saveModifiedFlagDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.submitFlagDetails(isFinalSubmit);
      expect(component.flagService.saveModifiedFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should set reference number', () => {
      component.flagDocuments = [];
      component.registrationNo = 200085744;
      component.flagForm = component.createAddFlagForm();
      component.flagForm.get('flagType').get('english').setValue('test');
      component.flagForm.get('flagReason').get('english').setValue('test');
      component.flagForm.get('justification').setValue(true);
      component.flagForm.get('endDate').get('gregorian').setValue(null);
      const isFinalSubmit = false;
      const documents = documentResponseItemList.map(doc => bindToObject(new DocumentItem(), doc));
      component.flagDocuments = documents;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      spyOn(component.flagService, 'saveModifiedFlagDetails').and.returnValue(of(new TransactionFeedback()));

      component.submitFlagDetails(isFinalSubmit);
      expect(component.flagService.saveModifiedFlagDetails).toHaveBeenCalled();
      expect(component.referenceNo).toBeDefined();
    });
  });

  describe('cancel Transaction', () => {
    it('should cancel the transaction', () => {
      component.referenceNo = 123;
      component.registrationNo = 123;
      component.isValidator = true;
      spyOn(component.changeEstablishmentService, 'cancelTransaction').and.returnValue(of(null));
      component.cancelTransaction(component.registrationNo, component.referenceNo);
      expect(component.changeEstablishmentService.router.navigate).toHaveBeenCalled();
    });
    it('should cancel the transaction', () => {
      component.isValidator = false;
      component.referenceNo = 123;
      component.registrationNo = 123;
      spyOn(component.location, 'back');
      spyOn(component.changeEstablishmentService, 'cancelTransaction').and.returnValue(of(null));
      component.cancelTransaction(component.registrationNo, component.referenceNo);
      expect(component.location.back).toHaveBeenCalled();
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
