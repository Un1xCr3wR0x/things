/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed,async } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService, ApplicationTypeToken, bindToObject, DocumentService, LanguageToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {  BehaviorSubject } from 'rxjs';
import { AlertServiceStub, contributorsTestData, DocumentServiceStub, injuryDetailsTestData, ModalServiceStub,InjuryMockService } from 'testing';
import { Disease  } from '../../shared';
import { DiseaseService } from '../../shared/services';

import { ViewDiseaseScComponent } from './view-disease-sc.component';

describe('ViewDiseaseScComponent', () => {
  let component: ViewDiseaseScComponent;
  let fixture: ComponentFixture<ViewDiseaseScComponent>;

  beforeEach( async(() =>  {
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
        declarations: [ViewDiseaseScComponent],
        providers: [
          { provide: DiseaseService, useClass: InjuryMockService },
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
      declarations: [ViewDiseaseScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewDiseaseScComponent);
    component = fixture.debugElement.componentInstance;
  });
  it("should create ViewDisease component", () => {
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

  describe(newFunction(), () => {
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
  // describe(' modifyDiseaseTransaction', () => {
  //   it('should  modifyDiseaseTransaction', () => {
  //     spyOn(component.router, 'navigate');
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasPendingChangeRequest = false;
  //     component['disease'].hasRejectionInProgress = false;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Cured Without Disability'
  //     };
  //     component.modifyDiseaseTransaction();
  //     expect(component.router.navigate).toHaveBeenCalled();
  //   });
  // });
  // describe(' modifyDiseaseTransaction', () => {
  //   it('should  modifyDiseaseTransaction', () => {
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasRejectionInProgress = true;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Approved' 
  //     };
  //     const modalRef = { elementRef: null, createEmbeddedView: null };
  //     component.modalRef = new BsModalRef();
  //     component.showModal(modalRef, 'lg');
  //     component.modifyDiseaseTransaction();
  //     expect(component.errorMessage).not.toBe(null);
  //   });
  // });

  // describe(' modifyDiseaseTransaction', () => {
  //   it('should  modifyDiseaseTransaction', () => {
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasPendingChangeRequest = true;
  //     component['disease'].hasRejectionInProgress = false;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Approved'
  //     };
  //     const modalRef = { elementRef: null, createEmbeddedView: null };
  //     component.modalRef = new BsModalRef();
  //     component.showModal(modalRef, 'lg');
  //     component.modifyDiseaseTransaction();
  //     expect(component.errorMessage).not.toBe(null);
  //   });
  // });

  // describe(' modifyDiseaseTransaction', () => {
  //   it('should  modifyDiseaseTransaction', () => {
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasPendingChangeRequest = true;
  //     component['disease'].hasRejectionInProgress = false;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Approved'
  //     };
  //     const modalRef = { elementRef: null, createEmbeddedView: null };
  //     component.modalRef = new BsModalRef();
  //     component.showModal(modalRef, 'lg');
  //     component.modifyDiseaseTransaction();
  //     expect(component.errorMessage).not.toBe(null);
  //   });
  // });
  // it('should show modal', () => {
  //   const modalRef = { elementRef: null, createEmbeddedView: null };
  //   component.modalRef = new BsModalRef();
  //   component.showModal(modalRef, 'lg');
  //   expect(component.modalRef).not.toEqual(null);
  // });

  describe(' reopenDiseaseTransaction', () => {
    it('should  reopenDiseaseTransaction', () => {
      spyOn(component.router, 'navigate');
      component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
      component['disease'].hasRejectionInProgress = false;
      component['disease'].diseaseStatus = {
        arabic: 'معـلّـق',
        english: 'Rejected'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenDiseaseTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });

  describe(' reopenDiseaseTransaction', () => {
    it('should  reopenDiseaseTransaction', () => {
      spyOn(component.router, 'navigate');
      component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
      component['disease'].hasRejectionInProgress = true;
      component['disease'].diseaseStatus = {
        arabic: 'معـلّـق',
        english: 'Closed without continuing treatment'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenDiseaseTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });

  describe(' reopenDiseaseTransaction', () => {
    it('should  reopenDiseaseTransaction', () => {
      spyOn(component.router, 'navigate');
      component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
      component['disease'].hasRejectedComplication = true;
      component['disease'].diseaseStatus = {
        arabic: 'معـلّـق',
        english: 'Rejected'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenDiseaseTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });
  describe(' reopenDiseaseTransaction', () => {
    it('should  reopenDiseaseTransaction', () => {
      spyOn(component.router, 'navigate');
      component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
      component['disease'].reopenAllowedIndicator = true;
      component['disease'].hasPendingChangeRequest = true;
      component['disease'].diseaseStatus = {
        arabic: 'معـلّـق',
        english: 'Rejected'
      };
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.showModal(modalRef, 'lg');
      component.reopenDiseaseTransaction();
      expect(component.errorMessage).not.toBe(null);
    });
  });

  // describe('rejectInjury', () => {
  //   it('should  rejectInjury', () => {
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasPendingChangeRequest = true;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Approved'
  //     };
  //     component.rejectInjury();
  //     expect(component.errorMessage).not.toBe(null);
  //     expect(component.modalHeader).not.toBe(null);
  //   });
  // });

  // describe('rejectInjury', () => {
  //   it('should  rejectInjury', () => {
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].rejectionAllowedIndicator = false;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Cured With Disability'
  //     };
  //     component.rejectInjury();
  //     expect(component.errorMessage).not.toBe(null);
  //     expect(component.modalHeader).not.toBe(null);
  //   });
  // });

  // describe('rejectInjury', () => {
  //   it('should  rejectInjury', () => {
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasPendingChangeRequest = true;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Closed without continuing treatment'
  //     };
  //     component.rejectInjury();
  //     expect(component.errorMessage).not.toBe(null);
  //     expect(component.modalHeader).not.toBe(null);
  //   });
  // });

  // describe('rejectInjury', () => {
  //   it('should  rejectInjury', () => {
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasPendingChangeRequest = false;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Cured With Disability'
  //     };
  //     component.rejectInjury();
  //     expect(component.errorMessage).not.toBe(null);
  //     expect(component.modalHeader).not.toBe(null);
  //   });
  // });

  // describe(' rejectInjury', () => {
  //   it('should  rejectInjury', () => {
  //     spyOn(component.router, 'navigate');
  //     component['disease'] = bindToObject(new Disease(), injuryDetailsTestData.injuryDetailsDto);
  //     component['disease'].hasPendingChangeRequest = false;
  //     component['disease'].diseaseStatus = {
  //       arabic: 'معـلّـق',
  //       english: 'Approved'
  //     };
  //     component.rejectInjury();
  //     expect(component.errorMessage).not.toBe(null);
  //     expect(component.modalHeader).not.toBe(null);
  //   });
  // });

  
  describe('decline', () => {
    it('should decline', () => {
      component.bsModalRef = new BsModalRef();
      spyOn(component.bsModalRef, 'hide');
      component.clearModal();
      expect(component.bsModalRef.hide).toHaveBeenCalled();
    });
  });

});
function newFunction(): string {
  return ' setServiceVariables';
}

