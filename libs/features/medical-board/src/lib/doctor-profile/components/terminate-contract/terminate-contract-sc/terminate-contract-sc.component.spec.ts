/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
  LanguageToken,
  BilingualText,
  Alert,
  WizardItem,
  DocumentItem,
  EnvironmentToken
} from '@gosi-ui/core';
import { DoctorService, MbRouteConstants, MemberService } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ActivatedRouteStub,
  genericError,
  LookupServiceStub,
  DoctorServiceStub,
  MemberServiceStub,
  ModalServiceStub,
  memberDataMock,
  terminateContractMock
} from 'testing';
import { TerminateContractScComponent } from './terminate-contract-sc.component';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { tap } from 'rxjs/operators';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ identificationNo: 201576765 });

describe('TerminateContractScComponent', () => {
  let component: TerminateContractScComponent;
  let fixture: ComponentFixture<TerminateContractScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [TerminateContractScComponent],
      providers: [
        FormBuilder,
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(TerminateContractScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('must initialize component', () => {
    (activatedRouteStub as any).paramMap = of(
      convertToParamMap({
        identificationNo: 201576765,
        contractId: 1234
      })
    );
    activatedRouteStub.paramMap.subscribe(params => {
      component.identificationNo = +params.get('identificationNo');
      component.identificationNo = +params.get('contractId');
    });
    component.ngOnInit();
  });
  it('should get wizard item', () => {
    spyOn(component, 'getWizardItems').and.callThrough();
    component.getWizardItems();
    expect(component.getWizardItems).toHaveBeenCalled();
  });
  // should call selectModifyWizard
  it('should call selectModifyWizard', () => {
    const wizardIndex = 2;
    component.selectTerminateWizard(wizardIndex);
  });
  it('Should call showErrorMessage', () => {
    spyOn(component.alertService, 'showError');
    component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
    expect(component.alertService.showError).toHaveBeenCalled();
  });

  //cancel popup
  it('should cancel popup', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.popUpCancel(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });

  //show modal
  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showTemplate(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });
  //decline
  it('It should decline', () => {
    component.modalRef = new BsModalRef();
    spyOn(component.modalRef, 'hide');
    component.decline();
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  //show form invalid
  it('should show mandatory error', () => {
    spyOn(component.alertService, 'showMandatoryErrorMessage');
    component.showFormInvalid();
    expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
  });

  it('Should navigate to pervious section', () => {
    component.terminateContractWizard = new ProgressWizardDcComponent();
    component.terminateContractWizard.wizardItems = [new WizardItem('Label', 'Icon')];
    component.activeTab = 1;
    spyOn(component.terminateContractWizard, 'setPreviousItem').and.callThrough();
    component.previousForm();
    expect(component.activeTab).toEqual(0);
  });

  it('should fetch next form', () => {
    component.activeTab = 1;
    component.totalTabs = 2;
    component.terminateContractWizard = new ProgressWizardDcComponent();
    component.initializeWizard();
    component.nextForm();
    expect(component.activeTab).not.toBe(null);
    expect(component.modifyTab.tabs).not.toBe(null);
  });
  it('It should confirmCancel', () => {
    component.mbProfessionalId = 100000342;
    component.modalRef = new BsModalRef();
    // spyOn(component.router,'navigate')
    spyOn(component.doctorService, 'revertTransactionDetails').and.callThrough();
    spyOn(component.modalRef, 'hide');
    component.confirmCancel();
    // expect(component.router.navigate).toHaveBeenCalledWith([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(component.identificationNo)])
    expect(component.terminateData).not.toEqual(null);
    expect(component.modalRef.hide).toHaveBeenCalled();
  });
  it('It should throw err for confirmCancel', () => {
    spyOn(component.doctorService, 'revertTransactionDetails').and.returnValue(throwError(genericError));
    spyOn(component.alertService, 'showError');
    component.confirmCancel();
    expect(component.terminateData).toBeUndefined();
  });
  it('Should call showErrorMessage', () => {
    spyOn(component.alertService, 'showError');
    component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
    expect(component.alertService.showError).toHaveBeenCalled();
  });
  it('should refresh document', () => {
    spyOn(component.documentService, 'refreshDocument').and.callThrough();
    component.refreshDocument(new DocumentItem());
    expect(component.documentService.refreshDocument).toHaveBeenCalled();
  });
  it('should saveDetails', () => {
    spyOn(component.doctorService, 'terminateContract').and.callThrough();
    component.saveDetails(terminateContractMock);
    expect(component.doctorService.terminateContract).toHaveBeenCalled();
    expect(component.terminateData).toBe(terminateContractMock);
  });
  it('should throw err for saveDetails', () => {
    spyOn(component, 'showError').and.callThrough();
    spyOn(component.doctorService, 'terminateContract').and.returnValue(throwError(genericError));
    component.saveDetails(terminateContractMock);
    expect(component.showError).toHaveBeenCalled();
  });
  it('should get documents', () => {
    spyOn(component.documentService, 'getDocuments').and.callThrough();
    component.getDocumentList();
    component.documentService.getDocuments('personDetails', 'status', 10).pipe(
      tap(res => {
        expect(res).not.toBe(null);
      })
    );
    expect(component.documentList).not.toBeNull();
  });
  it('shdould throw errr on document upload', () => {
    spyOn(component, 'showError');
    spyOn(component.doctorService, 'submitTerminateContract').and.returnValue(throwError(genericError));
    component.submitDocument('docComment');
    expect(component.showError).toHaveBeenCalled();
  });
  it('should submitDocument', () => {
    spyOn(component.doctorService, 'submitTerminateContract').and.callThrough();
    component.submitDocument('added');
    expect(component.doctorService.submitTerminateContract).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith([
      MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(component.identificationNo)
    ]);
  });
});
