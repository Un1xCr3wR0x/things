/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentService,
  LookupService,
  AlertService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  genericErrorOh,
  OhMockService,
  DocumentServiceStub,
  holdAllowanceDetails,
  claimsWrapper,
  LookupServiceStub,
  injuryHistoryTestData,
  filterParamsClaims,
  claimsWrapperData,
  claimsWrapperReimb,
  InjuryMockService,
  ComplicationMockService,
  ContributorMockService,
  EstablishmentMockService,
  AlertServiceStub,
  ModalServiceStub
} from 'testing';
import {
  OhService,
  HoldResumeDetails,
  InjuryService,
  ComplicationService,
  EstablishmentService,
  ContributorService
} from '../../shared';
import { ClaimsWrapper } from '../../shared/models/claims-details';
import { ClaimsDetailsScComponent } from './claims-details-sc.component';
import { OhClaimsService } from '../../shared/services/oh-claims.service';
import { FormBuilder } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Claims } from '../../shared/models/claims-wrapper';
describe('ClaimsDetailsScComponent', () => {
  let component: ClaimsDetailsScComponent;
  let fixture: ComponentFixture<ClaimsDetailsScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), BrowserModule, BrowserDynamicTestingModule, RouterTestingModule],
      declarations: [ClaimsDetailsScComponent],
      providers: [
        { provide: LookupService, useValue: LookupServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: OhService, useClass: OhMockService },
        { provide: OhClaimsService, useClass: OhMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        FormBuilder,
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: EstablishmentService, useClass: EstablishmentMockService },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'Private' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ApplicationTypeToken, useValue: 'Private' },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize the component', () => {
    component.currentTab = 0;
    spyOn(component, 'getData');
    component.ngOnInit();
    expect(component.getData).toHaveBeenCalled();
  });
  describe('getRegistrationNumber', () => {
    it('should getRegistrationNumber', () => {
      spyOn(component.ohService, 'getRegistrationNumber');
      component.getData();
      expect(component.ohService.getRegistrationNumber).not.toBe(null);
    });
  });
  /*describe('getLookUpValues', () => {
     it('should getLookUpValues', () => {
        spyOn(component.lookupService,'getTransactionStatusList')
       component.getLookUpValues();
       expect(component.statusTemp$).toBeTruthy();
       expect(component.claimType$).toBeTruthy();
       expect(component.claimPayee$).toBeTruthy();
       expect(component.lookupService.getTransactionStatusList).not.toEqual(null);
    });
   });*/
  describe('getTotalClaims', () => {
    it('should getTotalClaims', () => {
      component.claimsWrapper = bindToObject(component.claimsWrapper, claimsWrapper);
      component.claimsWrapper.claims = bindToObject(component.claimsWrapper.claims, claimsWrapper.claims);
      component.claimList = claimsWrapper.claims;
      spyOn(component, 'getTotalClaims');
      component.getTotalClaims();
      expect(component.totalExpense).not.toBe(null);
    });
  });
  describe('get newClaim', () => {
    it('should getnewClaim', () => {
      spyOn(component.router, 'navigate');
      component.complicationId = null;
      component.isEstClosed = false;
      component.injuryId = injuryHistoryTestData.injuryId;
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.newClaim();
      component.injuryNo = injuryHistoryTestData.injuryNo;
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${injuryHistoryTestData.registrationNo}/${injuryHistoryTestData.selectedSIN}/${injuryHistoryTestData.injuryId}/reimbursement`
      ]);
    });
  });
  describe('get uploadDocuments For injury', () => {
    it('should uploadDocuments For injury', () => {
      spyOn(component.router, 'navigate');
      component.complicationId = null;
      component.injuryId = injuryHistoryTestData.injuryId;
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.injuryNo = injuryHistoryTestData.injuryNo;
      const event = {
        refernceNo: 132124,
        ReimbId: 123
      };
      component.uploadDocuments(event);
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${injuryHistoryTestData.registrationNo}/${injuryHistoryTestData.selectedSIN}/${injuryHistoryTestData.injuryId}/123/claims/upload-documents`
      ]);
    });
  });
  describe('get uploadDocuments For Complication', () => {
    it('should uploadDocuments For Complication', () => {
      spyOn(component.router, 'navigate');
      component.complicationId = injuryHistoryTestData.complicationId;
      component.injuryId = injuryHistoryTestData.injuryId;
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.injuryNo = 1002318957;
      component.ohService.setInjuryNumber(injuryHistoryTestData.injuryNo);
      const event = {
        refernceNo: 132124,
        ReimbId: 123
      };
      component.uploadDocuments(event);
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${injuryHistoryTestData.registrationNo}/${injuryHistoryTestData.selectedSIN}/[object Object]/${injuryHistoryTestData.complicationId}/123/claims/upload-documents`
      ]);
    });
  });
  describe('getDetails', () => {
    it('should getDetails', () => {
      component.claimsWrapper = bindToObject(component.claimsWrapper, claimsWrapper);
      spyOn(component, 'getDetails').and.callThrough();
      component.getDetails(claimsWrapperData.claims[0], 0);
      expect(component.getDetails).toHaveBeenCalled();
    });
  });
  /* describe('getDetails For Reimbursement', () => {
    it('should getDetails For Reimbursement', () => {
      component.claimsWrapper = bindToObject(component.claimsWrapper, claimsWrapperReimb);
      spyOn(component, 'getDetails').and.callThrough();
      component.getDetails(claimsWrapperData.claims[0], 0);
      expect(component.getDetails).toHaveBeenCalled();
    });
  });*/
  describe('getSocialInsuranceNo', () => {
    it('should getSocialInsuranceNo', () => {
      spyOn(component.ohService, 'getSocialInsuranceNo');
      component.getData();
      expect(component.ohService.getSocialInsuranceNo).not.toBe(null);
    });
  });
  describe('applyFilter', () => {
    it('should applyFilter', () => {
      spyOn(component, 'getClaimsDetails');
      spyOn(component.ohService, 'getClaimsDetails').and.returnValue(
        of(bindToObject(new ClaimsWrapper(), claimsWrapper))
      );
      component.claimList = claimsWrapper.claims;
      component.applyFilter(filterParamsClaims);
      expect(component.getClaimsDetails).toHaveBeenCalled();
    });
  });
  describe('getComplicationId', () => {
    it('should getComplicationId', () => {
      spyOn(component.ohService, 'getComplicationId');
      component.getData();
      expect(component.ohService.getComplicationId).not.toBe(null);
    });
  });
  describe('getInjuryId', () => {
    it('should getInjuryId', () => {
      spyOn(component.ohService, 'getInjuryId');
      component.getData();
      expect(component.ohService.getInjuryId).not.toBe(null);
    });
  });
  /* describe('getClaimsDetails', () => {
     it('should getClaimsDetails', () => {
       spyOn(component.ohService, 'getClaimsDetails').and.returnValue(
         of(bindToObject(new ClaimsWrapper(), claimsWrapper))
       );
       component.claimList = claimsWrapper.claims;
       component.getClaimsDetails();
       expect(component.claimsDetails).not.toBe(null);
     });
   });*/
  describe('getHoldDetails', () => {
    it('should getHoldDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.payeeId = 1;
      spyOn(component.ohService, 'fetchHoldAndAllowanceDetails').and.returnValue(
        of(bindToObject(new HoldResumeDetails(), holdAllowanceDetails))
      );
      component.holdDetails.requestType = 1;
      component.holdDetails.status = 1001;
      component.claimsWrapper = bindToObject(new ClaimsWrapper(), claimsWrapperReimb);
      component.getHoldDetails();
      expect(component.showHoldInfo).not.toBe(null);
    });
  });
  describe('getHoldDetails', () => {
    it('should getHoldDetails', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      component.payeeId = 1;
      spyOn(component.ohService, 'fetchHoldAndAllowanceDetails').and.returnValue(
        of(bindToObject(new HoldResumeDetails(), holdAllowanceDetails))
      );
      component.holdDetails.requestType = 2;
      component.holdDetails.status = 1001;
      component.claimsWrapper = bindToObject(new ClaimsWrapper(), claimsWrapperData);
      component.getHoldDetails();
      expect(component.holdDetails).not.toBe(null);
    });
  });
  describe('getRecoveryDetails', () => {
    it('should getRecoveryDetails', () => {
      component.claimsWrapper = bindToObject(new ClaimsWrapper(), claimsWrapperData);
      component.claimList = claimsWrapperReimb.claims;
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      spyOn(component.claimService, 'getRecoveryDetails').and.returnValue(
        of(bindToObject(new ClaimsWrapper(), claimsWrapperReimb))
      );
      component.getRecoveryDetails(21321, 12);
      expect(component.claimsWrapper).not.toBe(null);
    });
  });
  describe('getExpenseDetails', () => {
    it('should getExpenseDetails', () => {
      component.claimsWrapper = bindToObject(new ClaimsWrapper(), claimsWrapperData);
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      spyOn(component.ohService, 'getExpenseDetails').and.returnValue(
        of(bindToObject(new ClaimsWrapper(), claimsWrapperReimb))
      );
      component.getExpenseDetails(123, 12, 0);
      expect(component.ohService.getExpenseDetails).toHaveBeenCalled();
    });
  });
  /* describe('navigateTableView', () => {
    it('should navigateTableView', () => {
      component.claimList = claimsWrapper.claims;
      spyOn(component, 'navigateTableView').and.callThrough();
      component.navigateTableView();
      expect(component.setPaginationVariables).toHaveBeenCalled();
    });
  });
  describe('navigateTimelineView', () => {
    it('should navigateTimelineView', () => {
      component.claimList = claimsWrapper.claims;
      spyOn(component, 'navigateTimelineView').and.callThrough();
      component.navigateTimelineView();
      expect(component.setPaginationVariables).toHaveBeenCalled();
    });
  });*/
  describe('navigate To contributor search', () => {
    it('should navigate To contributor search', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      spyOn(component.router, 'navigate');
      component.navigateToContributor();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/profile/contributor/10000602/601336235/info']);
    });
  });
  describe('should navigate To Profile', () => {
    it('should navigate To Profile', () => {
      component.registrationNo = 10000602;
      component.socialInsuranceNo = 601336235;
      spyOn(component.router, 'navigate');
      component.navigateToEstProfile();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/establishment/profile/10000602/view']);
    });
  });
  describe('should navigate To Profile Else Path', () => {
    it('should navigate To Profile Else Path', () => {
      component.registrationNo = null;
      component.socialInsuranceNo = null;
      spyOn(component.router, 'navigate');
      component.navigateToEstProfile();
      expect(component.router.navigate).toHaveBeenCalledWith(['home/establishment/profile']);
    });
  });
  /*describe('getClaimsDetails', () => {
     it('getClaimsDetails should throw error', () => {
       spyOn(component.ohService, 'getClaimsDetails').and.returnValue(throwError(genericErrorOh));
       spyOn(component, 'showError').and.callThrough();
       component.isAppPrivate = true;
       component.getClaimsDetails();
       expect(component.showError).toHaveBeenCalled();
     });
   });*/
  describe('getRecoveryDetails', () => {
    it('getRecoveryDetails should throw error', () => {
      component.claimsWrapper = bindToObject(new ClaimsWrapper(), claimsWrapperReimb);
      component.claimsWrapper.claims = bindToObject(new Claims(), claimsWrapperReimb.claims);
      spyOn(component.claimService, 'getServiceDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getRecoveryDetails(21321, 12);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getExpenseDetails', () => {
    it('getExpenseDetails should throw error', () => {
      component.claimsWrapper = bindToObject(new ClaimsWrapper(), claimsWrapperReimb);
      component.claimsWrapper.claims = bindToObject(new Claims(), claimsWrapperReimb.claims);
      component.claimList = claimsWrapperReimb.claims;
      spyOn(component.ohService, 'getExpenseDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getExpenseDetails(12, 123, 0);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getServiceDetails', () => {
    it('getServiceDetails should throw error', () => {
      component.claimsWrapper = bindToObject(new ClaimsWrapper(), claimsWrapperReimb);
      component.claimList = claimsWrapperData.claims;
      spyOn(component.claimService, 'getServiceDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getServiceDetails(21321, 12);
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getHoldDetails', () => {
    it('getHoldDetails should throw error', () => {
      spyOn(component.ohService, 'fetchHoldAndAllowanceDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getHoldDetails();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getBreakUpDetails', () => {
    it('getBreakUpDetails should throw error', () => {
      spyOn(component.ohService, 'getBreakUpDetails').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getBreakUpDetails(123, 1324, 1);
      expect(component.showError).toHaveBeenCalled();
    });
  });
});
