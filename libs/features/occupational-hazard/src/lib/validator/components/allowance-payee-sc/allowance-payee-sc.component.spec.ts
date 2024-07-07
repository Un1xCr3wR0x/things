/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken,
  LovList
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  ComplicationMockService,
  ContributorMockService,
  DocumentServiceStub,
  InjuryMockService,
  OhMockService,
  holdData,
  lovListMockData,
  genericErrorOh,
  payeeDetails,
  contributorsTestData,
  payeeDetailsType1,
  payeeDetailsType2
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { AllowancePayeeScComponent } from './allowance-payee-sc.component';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

describe('AllowancePayeeScComponent', () => {
  let component: AllowancePayeeScComponent;
  let fixture: ComponentFixture<AllowancePayeeScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        ModalModule.forRoot()
      ],
      declarations: [AllowancePayeeScComponent],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpy },
        BsModalService,
        BsModalRef,
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: RouterDataToken,
          useValue: new RouterData().fromJsonToObject(routerMockToken)
        },
        { provide: OhClaimsService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowancePayeeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      spyOn(component.injuryService, 'getRejectReasonValidator');
      component.ngOnInit();
      expect(component.rejectReasonList).not.toBe(null);
    });
  });
  describe('getAllowancePayee', () => {
    it('should getAllowancePayee', () => {
      component.getAllowancePayee();
      expect(component.allowancePayee).not.toBe(null);
    });
  });
  describe('getContributor', () => {
    it('should getContributor', () => {
      component.getContributor();
      expect(component.contributor).not.toBe(null);
    });
  });
  /*describe(' navigate', () => {
    it('should  call navigate', () => {
      component.allowancePayee = payeeDetails;
      component.payeeId=100995675;
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component.navigate();
      expect(component.router.navigate).toHaveBeenCalledWith(
        [`home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/100995675/complication/info`]);
      });
  });*/
  describe(' navigate payeeDetailsType1', () => {
    it('should  call navigate payeeDetailsType1', () => {
      component.allowancePayee = payeeDetailsType1;
      component.payeeId = 100995675;
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.navigate();
      expect(component.diseaseIdMessage).not.toBe(null);
    });
  });
  describe(' navigate payeeDetailsType2', () => {
    it('should  call navigate payeeDetailsType2', () => {
      component.allowancePayee = payeeDetailsType2;
      component.payeeId = 100995675;
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component.navigate();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/100995675/complication/info`
      ]);
    });
  });
  describe(' setValues', () => {
    it('should  call setValues', () => {
      spyOn(component, 'setValues').and.callThrough();
      component.setValues();
      expect(component.setValues).toHaveBeenCalled();
    });
  });
  describe('getAllowancePayee', () => {
    it('should getAllowancePayee', () => {
      component.getValues(new RouterData().fromJsonToObject(holdData));
      component.getAllowancePayee();
      expect(component.allowancePayee).not.toBe(null);
    });
  });

  describe('getEstablishment', () => {
    it('should getEstablishment', () => {
      component.getEstablishment();
      expect(component.establishment).not.toBe(null);
    });
  });

  describe('Hide Modal', () => {
    it('should hide  popup', () => {
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      spyOn(component, 'confirmApprove');
      component.approvePayee();
      expect(component.confirmApprove).toHaveBeenCalled();
    });
  });
  describe('show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef, 'modal-md');
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('show allowancePayeeCancel', () => {
    it('should allowance Payee Cancel modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component.modalService, 'show');
      component.allowancePayeeCancel(modalRef);
      expect(component.modalService.show).toHaveBeenCalled();
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
  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectPayee(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('confirm Reject', () => {
    it('should confirm the rejection', () => {
      component.modalRef = new BsModalRef();
      component.referenceNo = 12345;
      spyOn(component, 'confirmRejectPayee');
      component.confirmRejectPayee();
      expect(component.confirmRejectPayee).toHaveBeenCalled();
    });
  });
  describe('confirm Reject', () => {
    it('should confirm the rejection', () => {
      component.modalRef = new BsModalRef();
      const fb = new FormBuilder();
      component.transactionNumber = 12345;
      component.rejectReasonList = of(new LovList([]), lovListMockData);
      component.reportAllowanceForm.addControl('comments', new FormControl('Test'));
      component.reportAllowanceForm.addControl('injuryRejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.reportAllowanceForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.confirmRejectPayee();
      component.hideModal();
      expect(component.reportAllowanceForm.getRawValue()).toBeDefined();
    });
    /*it('should throw error', () => {
      component.modalRef = new BsModalRef();
      const fb = new FormBuilder();
      component.transactionNumber = 12345;
      component.rejectReasonList = of(new LovList([]), lovListMockData);
      component.reportAllowanceForm.addControl('comments', new FormControl('Test'));
      component.reportAllowanceForm.addControl('injuryRejectionReason', fb.group({ english: 'Others', arabic: '' }));
      component.reportAllowanceForm.addControl('rejectionReason', fb.group({ english: 'Others', arabic: '' }));
      spyOn(component.workflowService, 'complicationRejection').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.hideModal();
      component.confirmRejectPayee();
      expect(component.showError).toHaveBeenCalled();
    });*/
  });
});
