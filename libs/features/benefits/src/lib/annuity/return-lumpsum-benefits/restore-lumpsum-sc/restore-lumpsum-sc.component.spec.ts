/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  Alert,
  ApplicationTypeToken,
  BilingualText,
  DocumentItem,
  DocumentService,
  LanguageToken,
  Lov,
  RouterData,
  RouterDataToken,
  WizardItem
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { comments } from '@gosi-ui/features/occupational-hazard/lib/shared/models/date';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  DocumentServiceStub,
  genericErrorOh,
  ManagePersonServiceStub,
  ModalServiceStub,
  TranslateLoaderStub
} from 'testing';
import {
  BenefitDocumentService,
  clearAlerts,
  EnableRepaymentResponse,
  ReturnLumpsumDetails,
  ReturnLumpsumService,
  UITransactionType,
  ActiveBenefits,
  StopSubmitRequest
} from '../../../shared';
import { RestoreLumpsumScComponent } from './restore-lumpsum-sc.component';
describe('RestoreLumpsumScComponent', () => {
  let component: RestoreLumpsumScComponent;
  let fixture: ComponentFixture<RestoreLumpsumScComponent>;
  const returnLumpsumServicespy = jasmine.createSpyObj<ReturnLumpsumService>('ReturnLumpsumService', [
    'getReasonLovList',
    'getSavedActiveBenefit',
    'getLumpsumRepaymentDetails',
    'getRepayId',
    'submitRestore',
    'submitRestoreEdit',
    'getReqDocsForRestoreLumpsum'
  ]);
  const repayID = 32323;
  const submitValues: StopSubmitRequest = {
    comments: '',
    referenceNo: 232323,
    uuid: ''
  };
  returnLumpsumServicespy.getRepayId.and.returnValue(repayID);
  returnLumpsumServicespy.getReasonLovList.and.returnValue(of([new Lov()]));
  returnLumpsumServicespy.getSavedActiveBenefit.and.returnValue(
    new ActiveBenefits(2334, 455, { arabic: 'التعطل عن العمل (ساند)', english: 'Pension Benefits' }, 45454)
  );
  returnLumpsumServicespy.getReqDocsForRestoreLumpsum.and.returnValue(of([new DocumentItem()]));
  returnLumpsumServicespy.getLumpsumRepaymentDetails.and.returnValue(of(new ReturnLumpsumDetails()));
  returnLumpsumServicespy.submitRestoreEdit.and.returnValue(of(new EnableRepaymentResponse()));
  returnLumpsumServicespy.submitRestore.and.returnValue(of({ ...new EnableRepaymentResponse(), submitValues }));
  const benefitDocumentServicespy = jasmine.createSpyObj<BenefitDocumentService>('BenefitDocumentService', [
    'getUploadedDocuments'
  ]);
  benefitDocumentServicespy.getUploadedDocuments.and.returnValue(of([new DocumentItem()]));
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'refreshDocument',
    'getRequiredDocuments'
  ]);
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [RestoreLumpsumScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ReturnLumpsumService, useValue: returnLumpsumServicespy },
        { provide: BenefitDocumentService, useValue: benefitDocumentServicespy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestoreLumpsumScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      component.getScreenSize();
      component.getLookupValues();
      component.checkValidatorEditFlow();
      component.initialiseViewForEdit();
      expect(component.ngOnInit).toBeDefined();
      expect(component.getLookupValues).not.toEqual(null);
    });
  });
  describe('initialiseTabWizards', () => {
    it('check if currentTab is equal to 1', () => {
      component.currentTab = 1;
      component.wizardItems[0];
      component.wizardService.getRestoreLumpsumWizardItems();
      component.currentTab == 1;
      component.initialiseTabWizards();
      expect(component.initialiseTabWizards).toBeDefined();
    });
  });
  describe('getLookupValues', () => {
    it('check getLookupValues', () => {
      component.getLookupValues();
      expect(component.getLookupValues).toBeDefined();
    });
  });
  describe('selectedWizard', () => {
    it('should select wizard', () => {
      const index = 1;
      spyOn(component, 'selectWizard');
      component.selectedWizard(index);
      expect(component.selectedWizard).toBeDefined();
    });
  });
  describe('getUploadedDocuments', () => {
    it('should getUploadedDocuments', () => {
      const transactionKey = UITransactionType.RESTORE_LUMPSUM_BENEFIT;
      const transactionType = UITransactionType.FO_REQUEST_SANED;
      component.enableRepaymentId = 3423323;
      component.getUploadedDocuments(component.enableRepaymentId);
      component.benefitDocumentService
        .getUploadedDocuments(component.enableRepaymentId, transactionKey, transactionType)
        .subscribe(res => {
          component.requiredDocs = res;
        });
      expect(component.getUploadedDocuments).toBeDefined();
    });
  });
  describe('saveRestoreReason', () => {
    it('should saveRestoreReason', () => {
      spyOn(component, 'saveRestoreReason');
      // spyOn(component.alertService, 'clearAllErrorAlerts')
      // component.navigateRestoreWizard();
      component.saveRestoreReason();
      expect(component.saveRestoreReason).toBeDefined();
    });
  });
  describe('docUploadSuccess', () => {
    it('should submitStopped', () => {
      component.inRestoreEditMode = false;
      component.documentForm = new FormGroup({
        uploadDocument: new FormGroup({
          comments: new FormControl({ value: 'sdsdsd' })
        })
      });
      expect(component.inRestoreEditMode).toBeFalse();
      component.docUploadSuccess(comments);
      expect(component.docUploadSuccess).toBeDefined();
    });
  });
  describe('navigateRestoreWizard', () => {
    it('should navigateRestoreWizard', () => {
      component.restoreBenefitWizard = new ProgressWizardDcComponent();
      component.restoreBenefitWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      spyOn(component.restoreBenefitWizard, 'setNextItem').and.callThrough();
      component.navigateRestoreWizard();
      expect(component.currentTab).toEqual(2);
      expect(component.restoreBenefitWizard.setNextItem).toHaveBeenCalled();
    });
  });
  describe('saveWorkflowInEdit', () => {
    it('should saveWorkflowInEdit', () => {
      spyOn(component.manageBenefitService, 'updateAnnuityWorkflow').and.callThrough();
      component.saveWorkflowInEdit(comments);
      expect(component.saveWorkflowInEdit).toBeDefined();
    });
    it('should throw error ', () => {
      spyOn(component.manageBenefitService, 'updateAnnuityWorkflow').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showErrorMessage').and.callThrough();
      component.saveWorkflowInEdit(comments);
      expect(component.showErrorMessage).toBeDefined();
    });
  });

  describe('refreshDocument', () => {
    it('should refreshDocument', () => {
      const document = new DocumentItem();
      component.refreshDocument(document);
      expect(component.refreshDocument).toBeDefined();
    });
  });
  describe('previousForm', () => {
    it('should go to previous form', () => {
      component.restoreBenefitWizard = new ProgressWizardDcComponent();
      component.restoreBenefitWizard.wizardItems = [new WizardItem('Label', 'Icon')];
      component.currentTab = 1;
      spyOn(component.restoreBenefitWizard, 'setPreviousItem').and.callThrough();
      component.previousForm();
      expect(component.currentTab).toEqual(0);
      expect(component.restoreBenefitWizard.setPreviousItem).toHaveBeenCalled();
    });
  });
  describe('cancelTransaction', () => {
    it('should handle cancellation of transaction', () => {
      component.showModal(component.confirmTemplate);
      component.showOtpError = clearAlerts(component.alertService, component.showOtpError);
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('getScreenSize', () => {
    it('should getScreenSize', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('ShowModal', () => {
    it('should show modal reference', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      component.modalService.show(
        modalRef,
        Object.assign(
          {},
          {
            backdrop: true,
            ignoreBackdropClick: true
          }
        )
      );
      expect(component.showModal).toBeDefined();
    });
  });
  describe('showErrorMessage', () => {
    it('should show error message', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessage({ error: 'error' });
      component.showErrorMessage({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('showErrorMessages', () => {
    it('should showErrorMessages', () => {
      spyOn(component.alertService, 'showError');
      component.showErrorMessages({ error: 'error' });
      component.showErrorMessages({ error: { message: new BilingualText(), details: [new Alert()] } });
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
  describe('initialiseViewForEdit', () => {
    it('should initialiseViewForEdit', () => {
      component.inRestoreEditMode = true;
      expect(component.inRestoreEditMode).toBeTrue();
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      component.initialiseViewForEdit();
      expect(component.initialiseViewForEdit).toBeDefined();
    });
  });
});
