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
  DocumentService,
  RouterData,
  RouterDataToken,
  bindToObject,
  LanguageToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  contributorsTestData,
  DocumentServiceStub,
  InjuryMockService,
  ModalServiceStub,
  injuryDetailsTestData,
  genericErrorOh
} from 'testing';
import { Injury } from '../../shared';
import { InjuryService } from '../../shared/services';
import { ViewInjuryScComponent } from './view-injury-sc.component';
import { throwError, of, BehaviorSubject } from 'rxjs';

describe('ViewInjuryScComponent', () => {
  let component: ViewInjuryScComponent;
  let fixture: ComponentFixture<ViewInjuryScComponent>; 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [ViewInjuryScComponent],
      providers: [
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewInjuryScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewInjuryScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });
  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.ngOnInit();
      expect(component.socialInsuranceNo).not.toBe(null);
    });
  });
  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      spyOn(component, 'getEstablishment');
      spyOn(component, 'getContributor');
      component.ngOnInit();
      expect(component.getEstablishment).toHaveBeenCalled();
    });
  });

  describe(' getInjury', () => {
    it('should  getInjury', () => {
      component.getInjury();
      expect(component.getInjury).not.toBe(null);
    });
  });
  describe(' setServiceVariables', () => {
    it('should  call setServiceVariables', () => {
      spyOn(component, 'setServiceVariables').and.callThrough();
      spyOn(component.ohService, 'setRegistrationNo');
      component.setServiceVariables();
      expect(component.registrationNo).not.toBe(null); 
    });
  });
  describe(' setServiceVariables', () => {
    it('should  call setServiceVariables', () => {
      spyOn(component, 'setServiceVariables').and.callThrough();
      spyOn(component.ohService, 'setRegistrationNo');
      component.setServiceVariables();
      expect(component.setServiceVariables).toHaveBeenCalled();
    });
  });
  describe(' modifyInjuryTransaction', () => {
    it('should  modifyInjuryTransaction', () => {
      spyOn(component.router, 'navigate');
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasPendingChangeRequest = false;
      component['injury'].hasRejectionInProgress = false;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Cured Without Disability'
      };
      component.modifyInjuryTransaction();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' modifyInjuryTransaction', () => {
    it('should  modifyInjuryTransaction', () => {
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasRejectionInProgress = true;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Approved'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.modifyInjuryTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe(' modifyInjuryTransaction', () => {
    it('should  modifyInjuryTransaction', () => {
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasPendingChangeRequest = true;
      component['injury'].hasRejectionInProgress = false;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Approved'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.modifyInjuryTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe(' modifyInjuryTransaction', () => {
    it('should  modifyInjuryTransaction', () => {
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasPendingChangeRequest = true;
      component['injury'].hasRejectionInProgress = false;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Approved'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.modifyInjuryTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showModal(modalRef, 'lg');
    expect(component.modalRef).not.toEqual(null);
  });
  describe(' reopenInjuryTransaction', () => {
    it('should  reopenInjuryTransaction', () => {
      spyOn(component.router, 'navigate');
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasRejectionInProgress = false;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Rejected'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenInjuryTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe(' reopenInjuryTransaction', () => {
    it('should  reopenInjuryTransaction', () => {
      spyOn(component.router, 'navigate');
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasRejectionInProgress = true;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Closed without continuing treatment'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenInjuryTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe(' reopenInjuryTransaction', () => {
    it('should  reopenInjuryTransaction', () => {
      spyOn(component.router, 'navigate');
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasRejectedComplication = true;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Rejected'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenInjuryTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe(' reopenInjuryTransaction', () => {
    it('should  reopenInjuryTransaction', () => {
      spyOn(component.router, 'navigate');
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].reopenAllowedIndicator = true;
      component['injury'].hasPendingChangeRequest = true;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Rejected'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenInjuryTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe('rejectInjury', () => {
    it('should  rejectInjury', () => {
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasPendingChangeRequest = true;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Approved'
      };
      component.rejectInjury();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe('rejectInjury', () => {
    it('should  rejectInjury', () => {
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].rejectionAllowedIndicator = false;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Cured With Disability'
      };
      component.rejectInjury();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe('rejectInjury', () => {
    it('should  rejectInjury', () => {
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasPendingChangeRequest = true;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Closed without continuing treatment'
      };
      component.rejectInjury();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe('rejectInjury', () => {
    it('should  rejectInjury', () => {
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasPendingChangeRequest = false;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Cured With Disability'
      };
      component.rejectInjury();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe(' rejectInjury', () => {
    it('should  rejectInjury', () => {
      spyOn(component.router, 'navigate');
      component['injury'] = bindToObject(new Injury(), injuryDetailsTestData.injuryDetailsDto);
      component['injury'].hasPendingChangeRequest = false;
      component['injury'].injuryStatus = {
        arabic: 'معـلّـق',
        english: 'Approved'
      };
      component.rejectInjury();
      expect(component.errorMessage).not.toBe(null);
    });
  });

  describe('getInjury', () => {
    it('getInjury should throw error', () => {
      spyOn(component.injuryService, 'getInjuryDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getInjury();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.clearModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });
});

