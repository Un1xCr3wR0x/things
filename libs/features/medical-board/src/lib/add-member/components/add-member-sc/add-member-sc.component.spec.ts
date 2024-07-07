/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  bindToObject,
  DocumentItem,
  LookupService,
  WizardItem,
  NationalId,
  Passport,
  Iqama,
  startOfDay,
  RouterDataToken,
  RouterData,
  DocumentService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  documentListItemArray,
  LookupServiceStub,
  MemberServiceStub,
  ModalServiceStub,
  saudiMemberFormDetails,
  GccMemberFormDetails,
  NonSaudiMemberFormDetails,
  personDetails,
  personDetailsInDb,
  MbContractDetails,
  memberListMock,
  memberDataMock,
  DocumentServiceStub,
  genericError
} from 'testing';
import { MemberService } from '../../../shared/services';
import { AddMemberScComponent } from './add-member-sc.component';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme/src';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { throwError } from 'rxjs';

describe('AddMemberScComponent', () => {
  let component: AddMemberScComponent;
  let fixture: ComponentFixture<AddMemberScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [AddMemberScComponent],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: MemberService, useClass: MemberServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AddMemberScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get wizard item', () => {
    spyOn(component, 'getWizardItems').and.callThrough();
    component.getWizardItems();
    expect(component.getWizardItems).toHaveBeenCalled();
  });

  it('should select wizard', () => {
    spyOn(component, 'selectWizard').and.callThrough();
    component.selectWizard(1);
    expect(component.selectWizard).toHaveBeenCalled();
  });

  it('should show modal', () => {
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.showTemplate(modalRef);
    expect(component.modalRef).not.toEqual(null);
  });
  it('should verify saudi member', () => {
    spyOn(component.memberService, 'verifyMember').and.callThrough();
    component.verifyMemberDetails(saudiMemberFormDetails);
    const id = '1017511369';
    let birthDate = '2021-04-01';
    let nationality = {
      arabic: 'السعودية ',
      english: 'Saudi Arabia'
    };
    const personType = 'Saudi_Person';
    expect(component.memberService.verifyMember).toHaveBeenCalledWith(id, birthDate, nationality.english, personType);
  });

  it('should verify Gcc member', () => {
    spyOn(component.memberService, 'verifyMember').and.callThrough();
    component.verifyMemberDetails(GccMemberFormDetails);
    const id = '465847647654';
    let birthDate = '2021-04-01';
    let nationality = {
      arabic: 'السعودية',
      english: 'Kuwait'
    };
    const personType = 'GCC_Person';
    expect(component.memberService.verifyMember).toHaveBeenCalledWith(id, birthDate, nationality.english, personType);
  });
  it('should verify Gcc member', () => {
    spyOn(component.memberService, 'verifyMember').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.verifyMemberDetails(GccMemberFormDetails);
    expect(component.showError).toHaveBeenCalled();
  });
  it('should verify Gcc member', () => {
    spyOn(component.memberService, 'verifyMember').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.verifyMemberDetails(NonSaudiMemberFormDetails);
    expect(component.showError).toHaveBeenCalled();
  });
  it('should verify Gcc member', () => {
    spyOn(component.memberService, 'verifyMember').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.verifyMemberDetails(saudiMemberFormDetails);
    expect(component.showError).toHaveBeenCalled();
  });

  it('should verify Non Saudi member', () => {
    spyOn(component.memberService, 'verifyMember').and.callThrough();
    component.verifyMemberDetails(NonSaudiMemberFormDetails);
    const id = '2647282546';
    let birthDate = '2021-04-01';
    let nationality = {
      arabic: 'السعودية',
      english: 'Iraq'
    };
    const personType = 'Non_Saudi_Person';
    expect(component.memberService.verifyMember).toHaveBeenCalledWith(id, birthDate, nationality.english, personType);
  });
  // should call  mapValue
  it('should call  mapValue', () => {
    const data = memberDataMock;
    component.mapValue(data);
  });

  it('should reset verify', () => {
    component.resetVerify(true);
    expect(component.verified).toBeTrue();
    component.currentTab = 0;
    component.hasInitialised = false;
    component.restrictProgress(component.currentTab, component.mbwizardItems);
    expect(component.hasInitialised).toBeFalse();
  });
  it('should reset verify', () => {
    component.resetVerify(false);
    expect(component.verified).toBeFalse();
    component.currentTab = 0;
    component.hasInitialised = false;
    component.restrictProgress(component.currentTab, component.mbwizardItems);
    expect(component.hasInitialised).toBeFalse();
  });

  it('should navigate to add another member', () => {
    component.addAnotherMember();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home/medical-board/list-members']);
  });

  it('should refresh Document', () => {
    const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
    component.refreshDocument(document);
    expect(component.documentList).not.toBeNull();
  });

  it('should get documents', () => {
    spyOn(component.documentService, 'getDocuments').and.callThrough();
    component.getDocumentList();
    component.documentService.getDocuments('personDetails', 'status', 10).pipe(
      tap(res => {
        expect(res).not.toBe(null);
        //expect(component.nextForm).toHaveBeenCalled();
      })
    );
    expect(component.documentList).not.toBeNull();
  });
  it('should save member details', () => {
    spyOn(component.memberService, 'saveMemberDetails').and.callThrough();
    component.savememberFormDetails(personDetails);
    component.editMode = false;
    const status = 1;
    component.memberService.saveMemberDetails(personDetails, status).pipe(
      tap(res => {
        expect(res).not.toBe(null);
        expect(component.nextForm).toHaveBeenCalled();
      })
    );
    expect(component.memberService.saveMemberDetails).toHaveBeenCalledWith(personDetails, status);
    expect(memberDataMock.contractId).not.toBe(null);
    component.hasperson = true;
    component.member.contractId = memberDataMock.contractId;
    component.member.contractType = memberDataMock.contractType;
    expect(component.member).not.toBe(null);
  });
  it('should fetch next form', () => {
    component.currentTab = 0;
    component.totalTabs = 2;
    component.initializeWizard();
    expect(component.addMemberWizard).not.toBe(null);
  });

  it('should save contract details', () => {
    spyOn(component.memberService, 'saveMemberDetails').and.returnValue(throwError(genericError));
    spyOn(component, 'showError').and.callThrough();
    component.saveContractDetails(personDetails);
    const status = 1;
    component.memberService.saveMemberDetails(personDetails, status);
    expect(component.showError).toHaveBeenCalled();
  });
  it('should save contract details', () => {
    spyOn(component.memberService, 'saveMemberDetails').and.callThrough();
    component.saveContractDetails(personDetails);
    const status = 1;
    component.memberService.saveMemberDetails(personDetails, status).pipe(
      tap(res => {
        expect(res).not.toBe(null);
        expect(component.nextForm).toHaveBeenCalled();
      })
    );
    expect(component.memberService.saveMemberDetails).toHaveBeenCalledWith(personDetails, status);
    expect(component.member).not.toBe(null);
  });

  it('should save submit documents', () => {
    spyOn(component.memberService, 'saveMemberDetails').and.callThrough();
    spyOn(component.alertService, 'showMandatoryDocumentsError').and.callThrough();
    component.submitDocument(personDetails);
    const status = 1;
    component.memberService.saveMemberDetails(personDetails, status).pipe(
      tap(res => {
        expect(res).not.toBe(null);
        expect(component.nextForm).toHaveBeenCalled();
      })
    );
    expect(component.memberService.saveMemberDetails).toHaveBeenCalledWith(personDetails, status);
    component.alertService.showMandatoryDocumentsError();
    expect(component.member).not.toBe(null);
    expect(component.alertService.showMandatoryDocumentsError).toHaveBeenCalled();
  });

  it('should navigate to previous section', () => {
    component.addMemberWizard = new ProgressWizardDcComponent();
    component.addMemberWizard.wizardItems = [new WizardItem('Label', 'Icon')];
    component.currentTab = 1;
    component.previousForm();
    expect(component.currentTab).toEqual(0);
  });

  it('should getDataForEdit', () => {
    spyOn(component.memberService, 'getMemberDetails').and.callThrough();
    component.getDataForEdit();
    expect(component.memberService.getMemberDetails).toHaveBeenCalled();
  });
  it('should throw error for getDataForEdit', () => {
    spyOn(component.memberService, 'getMemberDetails').and.returnValue(throwError(genericError));
    component.getDataForEdit();
    expect(component.memberService.getMemberDetails).toHaveBeenCalled();
  });

  it('should bind the identity', () => {
    component.bindIdentity(memberListMock);
    expect(memberListMock).not.toBe(null);
  });
});
