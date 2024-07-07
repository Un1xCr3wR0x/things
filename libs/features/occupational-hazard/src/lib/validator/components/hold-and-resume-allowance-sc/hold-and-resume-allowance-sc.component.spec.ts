/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterConstants,
  RouterDataToken,
  bindToObject
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import {
  ComplicationMockService,
  ContributorMockService,
  DocumentServiceStub,
  InjuryMockService,
  OhMockService,
  holdData,
  resumeData,
  holdAllowanceDetails,
  holdAllowanceDetailsThree,
  holdAllowanceDetailsTwo
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { ComplicationService, ContributorService, InjuryService, OhService } from '../../../shared/services';
import { HoldAndResumeAllowanceScComponent } from './hold-and-resume-allowance-sc.component';
import { HoldResumeDetails } from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';

describe('HoldAndResumeAllowanceScComponent', () => {
  let component: HoldAndResumeAllowanceScComponent;
  let fixture: ComponentFixture<HoldAndResumeAllowanceScComponent>;
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
      declarations: [HoldAndResumeAllowanceScComponent],
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
    fixture = TestBed.createComponent(HoldAndResumeAllowanceScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getAllowancePayee', () => {
    it('should getAllowancePayee', () => {
      component.getData(new RouterData().fromJsonToObject(holdData));
      component.fetchHoldAndAllowanceDetails();
      expect(component.holdResumeDetails).not.toBe(null);
    });
  });
  describe('fetchHoldAndAllowanceDetails', () => {
    it('should fetchHoldAndAllowanceDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.payeeId = 1;
      spyOn(component.ohService, 'fetchHoldAndAllowanceDetails').and.returnValue(
        of(bindToObject(new HoldResumeDetails(), holdAllowanceDetails))
      );
      component.fetchHoldAndAllowanceDetails();
      expect(component.holdResumeDetails).not.toBe(null);
    });
  });
  describe('fetchHoldAndAllowanceDetails', () => {
    it('should fetchHoldAndAllowanceDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.payeeId = 1;
      spyOn(component.ohService, 'fetchHoldAndAllowanceDetails').and.returnValue(
        of(bindToObject(new HoldResumeDetails(), holdAllowanceDetailsTwo))
      );
      component.fetchHoldAndAllowanceDetails();
      expect(component.holdResumeDetails).not.toBe(null);
    });
  });
  describe('fetchHoldAndAllowanceDetails', () => {
    it('should fetchHoldAndAllowanceDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.payeeId = 1;
      spyOn(component.ohService, 'fetchHoldAndAllowanceDetails').and.returnValue(
        of(bindToObject(new HoldResumeDetails(), holdAllowanceDetailsThree))
      );
      component.fetchHoldAndAllowanceDetails();
      expect(component.holdResumeDetails).not.toBe(null);
    });
  });
  describe('getContributor', () => {
    it('should getContributor', () => {
      component.getData(new RouterData().fromJsonToObject(resumeData));
      component.getContributor();
      expect(component.contributor).not.toBe(null);
    });
  });
  describe('approve Modal', () => {
    it('should trigger the approval popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.approveModal(modalRef);
      expect(component.showModal).toHaveBeenCalled();
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
      expect(component.reportAllowanceForm.getRawValue()).toBeDefined();
    });
  });
  describe('approve transation', () => {
    it('should trigger the approval popup', () => {
      spyOn(component, 'confirmApprove');
      component.approveAllowance();
      expect(component.confirmApprove).toHaveBeenCalled();
    });
  });
  describe('reject transation', () => {
    it('should trigger the rejection popup', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.rejectAllowance(modalRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('confirm Reject', () => {
    it('should confirm the rejection', () => {
      component.modalRef = new BsModalRef();
      component.confirmRejectAllowance();
      component.hideModal();
      expect(component.reportAllowanceForm.getRawValue()).toBeDefined();
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
  describe('show modal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      spyOn(component, 'showModal');
      component.showModal(modalRef, 'modal-md');
      expect(component.showModal).toHaveBeenCalled();
    });
  });
  describe('cancel modal', () => {
    it('should cancel modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.confirmCancel();
      expect(component.router.navigate).toHaveBeenCalledWith([RouterConstants.ROUTE_INBOX]);
    });
  });
  describe('show cancel modal', () => {
    it('should showcancel modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component.modalService, 'show');
      component.allowanceCancel(templateRef);
      expect(component.modalService.show).toHaveBeenCalled();
    });
  });
  describe('show approve modal', () => {
    it('should approvw modal', () => {
      const templateRef = ({ key: 'testing', createText: 'abcd' } as unknown) as TemplateRef<HTMLElement>;
      spyOn(component, 'showModal');
      component.approveModal(templateRef);
      expect(component.showModal).toHaveBeenCalled();
    });
  });
});
