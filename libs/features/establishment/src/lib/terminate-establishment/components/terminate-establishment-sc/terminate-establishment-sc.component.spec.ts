/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  BilingualText,
  bindToObject,
  DocumentItem,
  LookupService,
  Lov,
  LovList,
  RouterConstants,
  StorageService,
  WorkflowService
} from '@gosi-ui/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { of, throwError } from 'rxjs';
import {
  branchListItemGenericResponse,
  documentResponseItemList,
  establishmentProfileResponse,
  EstablishmentStubService,
  establishmentWorkFlowStatusTestData,
  EstLookupServiceStub,
  genericBranchListResponse,
  genericBranchListWithStatusResponse,
  genericError,
  genericEstablishmentResponse,
  lovListData,
  StorageServiceStub,
  TerminateEstablishmentStubService,
  terminateResponseMock,
  transactionFeedbackMockData,
  WorkflowServiceStub
} from 'testing';
import {
  commonImports,
  commonProviders
} from '../../../change-establishment/components/change-basic-details-sc/change-basic-details-sc.component.spec';
import {
  EstablishmentService,
  TerminateEstablishmentService,
  TERMINATE_CONTRIBUTOR_LOV_VALUE,
  TRANSFER_CONTRIBUTOR_LOV_VALUE
} from '../../../shared';
import { TerminateEstablishmentScComponent } from './terminate-establishment-sc.component';

describe('TerminateEstablishmentScComponent', () => {
  let component: TerminateEstablishmentScComponent;
  let fixture: ComponentFixture<TerminateEstablishmentScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerminateEstablishmentScComponent],
      providers: [
        FormBuilder,
        ...commonProviders,
        {
          provide: WorkflowService,
          useClass: WorkflowServiceStub
        },
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        {
          provide: TerminateEstablishmentService,
          useClass: TerminateEstablishmentStubService
        },
        {
          provide: LookupService,
          useClass: EstLookupServiceStub
        },
        { provide: StorageService, useClass: StorageServiceStub }
      ],
      imports: [...commonImports, RouterModule.forRoot([]), NgxPaginationModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should call ngOnInit', () => {
      component['estRouterData'].resourceType = undefined;
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(
        of({ ...terminateResponseMock, hasActiveContributors: true, hasProactiveContributors: false })
      );
      spyOn(component.lookupService, 'getReasonForLeavingList').and.returnValue(of(lovListData));
      spyOn(component.lookupService, 'getTerminateContributorActionLovList').and.callThrough();
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.terminateEstablishmentService.selectedEstablishment = genericEstablishmentResponse;
      component.ngOnInit();
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).toHaveBeenCalled();
      expect(component.establishment).toBe(genericEstablishmentResponse);
      expect(component.showTransferContributor).toBe(true);
    });
    it('should call ngOnInit with error', () => {
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component['estRouterData'].resourceType = undefined;
      component.terminateEstablishmentService.selectedEstablishment = null;
      component.ngOnInit();
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).not.toHaveBeenCalled();
    });
    it('should call ngOnInit as validator', () => {
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(
        of({ ...terminateResponseMock, hasActiveContributors: true, hasProactiveContributors: false })
      );
      spyOn(component.lookupService, 'getReasonForLeavingList').and.returnValue(of(lovListData));
      spyOn(component.lookupService, 'getTerminateContributorActionLovList').and.callThrough();
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component['estRouterData'].resourceType = RouterConstants.TRANSACTION_TERMINATE_ESTABLISHMENT;
      component['estRouterData'].taskId = 'abdchs';
      component['estRouterData'].referenceNo = 123456;
      component['estRouterData'].registrationNo = 123456;
      component.terminateEstablishmentService.selectedEstablishment = genericEstablishmentResponse;
      component.ngOnInit();
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).toHaveBeenCalled();
      expect(component.establishment).toBe(genericEstablishmentResponse);
      expect(component.showTransferContributor).toBe(true);
    });
  });
  describe('intialiseView', () => {
    it('should call intialiseView as CSR edit', () => {
      component.isValidator = false;
      component.establishment = genericEstablishmentResponse;
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.intialiseView();
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).toHaveBeenCalled();
      expect(component.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
    it('should call intialiseView as validator edit', () => {
      component.isValidator = true;
      component.establishmentToChange = genericEstablishmentResponse;
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.intialiseView();
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).toHaveBeenCalled();
      expect(component.registrationNo).toBe(genericEstablishmentResponse.registrationNo);
    });
  });
  describe('initialiseTabWizards', () => {
    it('should call initialiseTabWizards', () => {
      component.initialiseTabWizards(2);
      expect(component.currentTab).toBe(2);
    });
  });
  describe('selectedPage', () => {
    it('should call selectedPage', () => {
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        of(genericBranchListWithStatusResponse)
      );
      component.selectedPage(2, '');
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).toHaveBeenCalled();
    });
    xit('should call selectedPage with errro', fakeAsync(() => {
      spyOn(component.establishmentService, 'getBranchEstablishmentsWithStatus').and.returnValue(
        throwError(genericError)
      );
      spyOn(component.alertService, 'showError');
      component.selectedPage(2, '');
      tick(100);
      expect(component.establishmentService.getBranchEstablishmentsWithStatus).toHaveBeenCalled();
      expect(component.isResultEmpty).toBeFalse();
    }));
  });
  describe('onSelectEstablishment', () => {
    it('should call onSelectEstablishment', () => {
      const establishment = genericBranchListResponse[3];
      component.branchEstablishments = genericBranchListResponse;
      component.selectedMainEstablishment = { ...branchListItemGenericResponse };
      component.onSelectEstablishment(establishment);
      expect(component.onSelectEstablishment).toBeTruthy();
    });
  });
  describe('naviagteBillDashboard', () => {
    it('should call naviagteBillDashboard', () => {
      spyOn(window, 'open');
      component.naviagteBillDashboard();
      expect(window.open).toHaveBeenCalled();
    });
  });
  describe('cancelModal', () => {
    it('should call cancelModal', () => {
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      component.terminateReferenceNo = 123;
      component.CBMReferenceNo = 123;
      component.isValidator = false;
      component.registrationNo = 123;
      component.cancelModal();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
    });
    it('should call cancelModal without CBMReferenceNo', () => {
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      component.terminateReferenceNo = 123;
      component.CBMReferenceNo = undefined;
      component.isValidator = false;
      component.registrationNo = 123;
      component.cancelModal();
      expect(component.changeEstablishmentService.revertTransaction).toHaveBeenCalled();
    });
    it('should call cancelModal without terminateReferenceNo', () => {
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      component.terminateReferenceNo = undefined;
      component.CBMReferenceNo = undefined;
      component.isValidator = false;
      component.registrationNo = 123;
      component.cancelModal();
      expect(component.changeEstablishmentService.revertTransaction).not.toHaveBeenCalled();
    });
    it('should call cancelModal with validator gol', () => {
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      component.isValidator = true;
      component.isPrivate = false;
      component.cancelModal();
      expect(component.changeEstablishmentService.revertTransaction).not.toHaveBeenCalled();
    });
    it('should call cancelModal with validator FO', () => {
      spyOn(component.changeEstablishmentService, 'revertTransaction').and.returnValue(of(null));
      component.isValidator = true;
      component.isPrivate = true;
      component.cancelModal();
      expect(component.changeEstablishmentService.revertTransaction).not.toHaveBeenCalled();
    });
  });

  describe('getBankName', () => {
    it('should call getBankName', () => {
      const lov = new Lov();
      lov.value.english = 'Alawwal Bank';
      spyOn(component.lookupService, 'getBankForIban').and.returnValue(of(new LovList([lov])));
      component.getBankName('50');
      expect(component.lookupService.getBankForIban).toHaveBeenCalled();
      expect(component.bankNameList?.items?.length).toEqual(1);
    });
    it('should call getBankName with error', () => {
      spyOn(component.lookupService, 'getBankForIban').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getBankName('abc');
      expect(component.lookupService.getBankForIban).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('setBranch', () => {
    it('should call setBranch', () => {
      spyOn(component.changeEstablishmentService, 'getEstablishmentWorkflowStatus').and.returnValue(
        of([establishmentWorkFlowStatusTestData])
      );
      component.isValidator = false;
      component.showBank = true;
      component.establishment = genericEstablishmentResponse;
      component.registrationNo = 110009305;
      component.isGcc = false;
      component.setBranch(genericBranchListWithStatusResponse, establishmentProfileResponse);

      expect(component.newMainEstRegistrationNo).toBe(establishmentProfileResponse.registrationNo);
    });
  });
  describe('submitCloseEstablishment', () => {
    it('should call submitCloseEstablishment with CBM', () => {
      spyOn(component.changeGrpEstablishmentService, 'saveMainEstablishment').and.returnValue(
        of(transactionFeedbackMockData)
      );
      component.apiCallInprogress = false;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      component.apiCallInprogress = false;
      component.showCBM = true;
      component.terminateReferenceNo = 123;
      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.submitCloseEstablishment();
      expect(component.changeGrpEstablishmentService.saveMainEstablishment).toHaveBeenCalled();
    });
    it('should call submitCloseEstablishment with CBM and transfer contributor', () => {
      spyOn(component.changeGrpEstablishmentService, 'saveMainEstablishment').and.returnValue(
        of(transactionFeedbackMockData)
      );
      component.apiCallInprogress = false;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      component.apiCallInprogress = false;
      component.showCBM = true;
      component.terminateReferenceNo = 123;
      component.terminateEstForm.addControl(
        'contributorDetails',
        component.fb.group({
          action: component.fb.group({
            english: [TRANSFER_CONTRIBUTOR_LOV_VALUE.english],
            arabic: null
          }),
          terminateDate: component.fb.group({
            gregorian: [{ value: new Date(), disabled: true }],
            hijiri: []
          }),
          terminateReason: component.fb.group({
            english: [null],
            arabic: [null]
          }),
          transferDate: component.fb.group({
            gregorian: [{ value: new Date(), disabled: true }],
            hijiri: []
          }),
          transferReason: component.fb.group({
            english: [null],
            arabic: [null]
          }),
          branchEstablishment: component.fb.group({
            english: [null],
            arabic: [null]
          })
        })
      );
      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.submitCloseEstablishment();
      expect(component.changeGrpEstablishmentService.saveMainEstablishment).toHaveBeenCalled();
    });
    it('should call submitCloseEstablishment with CBM and terminate contributor', () => {
      spyOn(component.changeGrpEstablishmentService, 'saveMainEstablishment').and.returnValue(
        of(transactionFeedbackMockData)
      );
      component.apiCallInprogress = false;
      spyOn(component.documentService, 'checkMandatoryDocuments').and.returnValue(true);
      component.apiCallInprogress = false;
      component.showCBM = true;
      component.terminateReferenceNo = 123;
      component.terminateEstForm.addControl(
        'contributorDetails',
        component.fb.group({
          action: component.fb.group({
            english: [TERMINATE_CONTRIBUTOR_LOV_VALUE.english],
            arabic: null
          }),
          terminateDate: component.fb.group({
            gregorian: [{ value: new Date(), disabled: true }],
            hijiri: []
          }),
          terminateReason: component.fb.group({
            english: [null],
            arabic: [null]
          }),
          transferDate: component.fb.group({
            gregorian: [{ value: new Date(), disabled: true }],
            hijiri: []
          }),
          transferReason: component.fb.group({
            english: [null],
            arabic: [null]
          }),
          branchEstablishment: component.fb.group({
            english: [null],
            arabic: [null]
          })
        })
      );
      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.submitCloseEstablishment();
      expect(component.changeGrpEstablishmentService.saveMainEstablishment).toHaveBeenCalled();
    });
    it('should call submitCloseEstablishment without CBM', () => {
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(of(terminateResponseMock));
      component.apiCallInprogress = false;
      component.showCBM = false;
      component.terminateReferenceNo = 123;
      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.submitCloseEstablishment();
      expect(component.terminateService.terminateEstablishment).toHaveBeenCalled();
    });
    it('should call submitCloseEstablishment as validator ', () => {
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(of(terminateResponseMock));
      const bilingualResponse = new BilingualText();
      spyOn(component, 'updateBpm').and.returnValue(of(bilingualResponse));
      component.apiCallInprogress = false;
      component.showCBM = false;
      component.isValidator = true;
      component.terminateReferenceNo = 123;

      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.submitCloseEstablishment();
      expect(component.terminateService.terminateEstablishment).toHaveBeenCalled();
    });
  });
  describe('saveBankAndContributorDetails', () => {
    it('should call saveBankAndContributorDetails with terminate reference no', () => {
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(of(terminateResponseMock));
      component.showBank = false;
      component.showCBM = false;
      component.terminateReferenceNo = 1234;
      component.showTransferContributor = false;
      component.establishment = genericEstablishmentResponse;

      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.saveBankAndContributorDetails();
      expect(component.terminateService.terminateEstablishment).not.toHaveBeenCalled();
    });
    it('should call saveBankAndContributorDetails with terminate reference no and CBM reference number', () => {
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(of(terminateResponseMock));
      component.documents = undefined;
      const docs = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      spyOn(component.changeGrpEstablishmentService, 'getDocuments').and.returnValue(of(docs));
      component.showBank = false;
      component.terminateReferenceNo = 1234;
      component.showCBM = false;
      component.CBMReferenceNo = 123;
      component.showTransferContributor = false;
      component.establishment = genericEstablishmentResponse;

      component.saveBankAndContributorDetails();
      expect(component.changeGrpEstablishmentService.getDocuments).toHaveBeenCalled();
      expect(component.terminateService.terminateEstablishment).not.toHaveBeenCalled();
    });
    it('should call saveBankAndContributorDetails with terminate reference no and with transactionReferenceIds ', () => {
      spyOn(component.terminateService, 'terminateEstablishment').and.returnValue(of(terminateResponseMock));
      component.showBank = false;
      component.showCBM = false;
      component.terminateReferenceNo = 1234;
      component.showTransferContributor = false;
      component.establishment = genericEstablishmentResponse;

      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [123] })
      );
      component.saveBankAndContributorDetails();
      expect(component.terminateService.terminateEstablishment).not.toHaveBeenCalled();
    });
  });
  describe('saveNewMainEstablishmentDetails', () => {
    it('should call saveNewMainEstablishmentDetails and show error', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.saveNewMainEstablishmentDetails(true);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    it('should call saveNewMainEstablishmentDetails and show same reg no error', () => {
      spyOn(component.alertService, 'showErrorByKey');
      component.newMainEstRegistrationNo = 123;
      component.mainEstablishmentRegNo = 123;
      component.saveNewMainEstablishmentDetails(true);
      expect(component.alertService.showErrorByKey).toHaveBeenCalled();
    });
    it('should call saveNewMainEstablishmentDetails', () => {
      spyOn(component.alertService, 'showErrorByKey');
      spyOn(component.changeGrpEstablishmentService, 'saveMainEstablishment').and.returnValue(
        of(transactionFeedbackMockData)
      );
      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.CBMDocuments = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.newMainEstRegistrationNo = 123;
      component.mainEstablishmentRegNo = 456;
      component.isPrivate = true;
      component.saveNewMainEstablishmentDetails(true);
      expect(component.changeGrpEstablishmentService.saveMainEstablishment).toHaveBeenCalled();
    });
    it('should call saveNewMainEstablishmentDetails as final submit false', () => {
      spyOn(component.alertService, 'showErrorByKey');
      spyOn(component.changeGrpEstablishmentService, 'saveMainEstablishment').and.returnValue(
        of(transactionFeedbackMockData)
      );
      component.documents = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.CBMDocuments = documentResponseItemList.map(doc =>
        bindToObject(new DocumentItem(), { ...doc, show: true, transactionReferenceIds: [] })
      );
      component.newMainEstRegistrationNo = 123;
      component.mainEstablishmentRegNo = 456;
      component.isPrivate = true;
      component.saveNewMainEstablishmentDetails(false);
      expect(component.changeGrpEstablishmentService.saveMainEstablishment).toHaveBeenCalled();
    });
  });
});
