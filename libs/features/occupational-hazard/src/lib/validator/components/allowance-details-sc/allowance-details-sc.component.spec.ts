/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  LanguageToken,
  RouterDataToken,
  RouterData,
  ApplicationTypeToken,
  ApplicationTypeEnum,
  bindToObject,
  DocumentService,
  DocumentItem,
  RouterConstants
} from '@gosi-ui/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  ModalServiceStub,
  contributorsTestData,
  genericErrorOh,
  claimsDetails,
  OhMockService,
  ComplicationMockService,
  ContributorMockService,
  DocumentServiceStub,
  InjuryMockService,
  initializeTheViewValidator1,
  initializeTheViewGDS,
  initializeTheViewValidator2,
  initializeTheViewFCApprover,
  allowance,
  Form,
  documentItemDataAudit
} from 'testing';
import { AllowanceDetailsScComponent } from './allowance-details-sc.component';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ClaimWrapper } from '../../../shared/models/claim-wrapper';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { RouterTestingModule } from '@angular/router/testing';
import { OhService, InjuryService, ComplicationService, ContributorService } from '../../../shared';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

describe('AllowanceDetailsScComponent', () => {
  let component: AllowanceDetailsScComponent;
  let fixture: ComponentFixture<AllowanceDetailsScComponent>;
  //const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, BrowserDynamicTestingModule, HttpClientTestingModule],
      declarations: [AllowanceDetailsScComponent],
      providers: [
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        {
          provide: RouterDataToken,
          useValue: new RouterData().fromJsonToObject(routerMockToken)
        },
        FormBuilder,
        { provide: OhClaimsService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowanceDetailsScComponent);
    component = fixture.componentInstance;
    spyOn(component, 'documentFetchForAllowance').and.returnValue(
      bindToObject(new DocumentItem(), documentItemDataAudit)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      spyOn(component.router, 'navigate');
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator1));
      component.navigateToScan();
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showSuccessByKey');
      component.navigateToInbox('APPROVE');
      component.navigateToInboxValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showSuccessByKey');
      component.navigateToInbox('APPROVE');
      component.navigateToInboxValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showSuccessByKey');
      component.navigateToInbox('REJECT');
      component.navigateToInboxValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showSuccessByKey');
      component.navigateToInbox('RETURN');
      component.navigateToInboxValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('navigateToInbox', () => {
    it('should navigateToInbox', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.alertService, 'showSuccessByKey');
      component.navigateToInbox('RETURN');
      component.navigateToInboxValidator();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      spyOn(component.router, 'navigate');
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewValidator2));
      component.navigateToScan();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/edit?activeTab=3']);
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      spyOn(component.router, 'navigate');
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewGDS));
      component.navigateToScan();
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe('intialiseTheView', () => {
    it('should intialiseTheView', () => {
      spyOn(component.router, 'navigate');
      component.intialiseTheView(new RouterData().fromJsonToObject(initializeTheViewFCApprover));
      component.navigateToScan();
      expect(component.canReturn).toBeFalsy();
    });
  });
  describe('getAllowance', () => {
    it('should getAllowance', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.injuryId = 100359522;
      component.referenceNo = 3413;
      spyOn(component.ohService, 'getallowanceDetail').and.returnValue(
        of(bindToObject(new ClaimWrapper(), claimsDetails))
      );
      component.getAllowance();
      expect(component.allowanceDetailsWrapper).not.toBe(null);
    });
  });
  describe('getAdditionalDetails', () => {
    it('should getAdditionalDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.injuryId = 100359522;
      component.referenceNo = 3413;
      spyOn(component, 'getBreakUpDetails').and.callThrough();
      component.getAdditionalDetails(allowance, allowance, 1);
      expect(component.getBreakUpDetails).toHaveBeenCalled();
    });
  });
  describe('approveWorkflow', () => {
    it('should approveWorkflow', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.injuryId = 100359522;
      component.referenceNo = 3413;
      spyOn(component.workflowService, 'updateTaskWorkflow').and.callThrough();
      component.approveWorkflow();
      expect(component.workflowService.updateTaskWorkflow).toHaveBeenCalled();
    });
  });

  describe('getAllowance', () => {
    it('should getAllowance', () => {
      spyOn(component.ohService, 'getallowanceDetail').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getAllowance();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('should navigate to Injury', () => {
    it('should navigate to  Injury', () => {
      spyOn(component.router, 'navigate');
      component.navigateToInjuryPage();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/oh/injury/modify']);
    });
  });
  describe('should navigate to view Injury', () => {
    it('should navigate to view Injury', () => {
      spyOn(component.router, 'navigate');
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component['allowanceDetailsWrapper'].ohType = 2;
      component.viewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${contributorsTestData.registrationNo}/${contributorsTestData.socialInsuranceNo}/${contributorsTestData.injuryId}/injury/info`
      ]);
    });
  });
  describe('should navigate to view Injury', () => {
    it('should navigate to view Injury', () => {
      spyOn(component, 'viewInjury');
      component.registrationNo = contributorsTestData.registrationNo;
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.injuryId = contributorsTestData.injuryId;
      component['allowanceDetailsWrapper'].ohType = 1;
      component.viewInjury();
      expect(component.message).not.toEqual(null);
    });
  });
  describe('should show modal', () => {
    it('should Show Modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('confirmCancel', () => {
    it('It should cancel', () => {
      spyOn(component.router, 'navigate');
      component.modalRef = new BsModalRef();
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('confirm Approve', () => {
    it('should confirm the approval', () => {
      component.modalRef = new BsModalRef();
      const fb = new Form();
      component.transactionNumber = 12345;
      component.reportAllowanceForm = fb.createAllowanceDetailsForm();
      component['routerData'].taskId = '1213';
      component['routerData'].resourceType = 'OH Rejection Complication';
      component['routerData'].payload =
        '[{"socialInsuranceNo":"601336235","resource":"OH Rejection Complication","registrationNo":"10000602","channel":"field-office","id":"1001926370","injuryId":"1432556"}]';
      spyOn(component, 'confirmApproveAllowance');
      component.confirmApproveAllowance();
      expect(component.confirmApproveAllowance).toHaveBeenCalled();
    });
  });
  describe('show cancel modal', () => {
    it('should showcancel modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.showAllowanceCancel(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveTransaction(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
});
