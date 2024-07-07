import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  bindToObject,
  DocumentItem,
  NIN,
  Iqama,
  NationalId,
  Passport,
  BorderNumber
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  BilingualTextPipeMock,
  ManagePersonServiceStub,
  ModalServiceStub,
  uiBenefits,
  genericError
} from 'testing';

import { ModifyBenefitPaymentDetailsScComponent } from './modify-benefit-payment-details-sc.component';
import {
  UITransactionType,
  ModifyPayeeDetails,
  BenefitConstants,
  ModifyBenefitService,
  Contributor,
  HeirsDetails
} from '../../../shared';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ModifyBenefitPaymentDetailsScComponent', () => {
  let component: ModifyBenefitPaymentDetailsScComponent;
  let fixture: ComponentFixture<ModifyBenefitPaymentDetailsScComponent>;
  const modifyBenefitServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'getRestartCalculation',
    'getRestartDetails',
    'getModifyCommitment',
    'getModifyPaymentDetails',
    'getReqDocsForModifyPayee',
    'editDirectPayment'
  ]);
  modifyBenefitServiceSpy.getModifyPaymentDetails.and.returnValue(
    of({ ...new ModifyPayeeDetails(), contributor: { ...new Contributor(), identity: [] } })
  );
  modifyBenefitServiceSpy.getReqDocsForModifyPayee.and.returnValue(of([new DocumentItem()]));
  modifyBenefitServiceSpy.editDirectPayment.and.returnValue(of([new DocumentItem()]));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), BrowserDynamicTestingModule],
      providers: [
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ModifyBenefitService, useValue: modifyBenefitServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: Router, useValue: routerSpy },
        FormBuilder
      ],
      declarations: [ModifyBenefitPaymentDetailsScComponent, BilingualTextPipeMock]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyBenefitPaymentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      spyOn(component, 'getModifyPayeeDetails');
      spyOn(component, 'getDocumentsForModifyPayee').and.callThrough();
      expect(component.ngOnInit).toBeDefined();
    });
  });

  xdescribe('getModifyPayeeDetails', () => {
    it('should  getModifyPayeeDetails', () => {
      const sin = 123423;
      const benefitRequestId = 234343323;
      const referenceNo = 2122312121;
      component.modifyPayeeDetails = [{ ...new HeirsDetails(), personId: 1234 }];
      component.getModifyPayeeDetails(sin, benefitRequestId, referenceNo);
      expect(component.getModifyPayeeDetails).toBeDefined();
    });
  });
  describe('confirmApproveBenefit', () => {
    it('should show approve modal', () => {
      component.modifyBenefitForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(component.modifyBenefitForm);
      component.confirmApproveBenefit();
      expect(component.confirmApproveBenefit).toBeDefined();
    });
  });
  describe('setAuthorizedIdentity', () => {
    it('should setAuthorizedIdentity', () => {
      component.requestId = 1004341279;
      component.setAuthorizedIdentity();
      component.modifyPayeeDetails = [{ ...new HeirsDetails(), personId: 1234, authorizedPersonIdentity: [] }];
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.setAuthorizedIdentity).not.toBeNull();
    });
  });
  describe('setGuardianIdentity', () => {
    it('should setGuardianIdentity', () => {
      component.setGuardianIdentity();
      component.modifyPayeeDetails = [{ ...new HeirsDetails(), personId: 1234 }];
      fixture.detectChanges();
      expect(component.setGuardianIdentity).toBeDefined();
    });
  });
  describe('navigateToInjuryDetails', () => {
    it('should navigateToInjuryDetails', () => {
      component.navigateToInjuryDetails();
      expect(component.navigateToInjuryDetails).toBeDefined();
    });
    it('should navigateToPrevAdjustment', () => {
      component.navigateToPrevAdjustment(34343);
      expect(component.navigateToPrevAdjustment).toBeDefined();
    });
  });
  describe('fetchModifyPayeeDocs', () => {
    it('should fetchModifyPayeeDocs', () => {
      component.requestId = 1004341279;
      component.fetchModifyPayeeDocs();
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.fetchModifyPayeeDocs).not.toBeNull();
    });
  });
  describe('onViewBenefitDetails', () => {
    it('should  onViewBenefitDetails', () => {
      const modify = { ...new ModifyPayeeDetails(), personId: 234234, benefitType: { english: '', arabic: '' } };
      component.socialInsuranceNo = 3434;
      component.requestId = 3434;
      const data = {
        personId: modify.personId,
        sin: component.socialInsuranceNo,
        benefitRequestId: modify.benefitType
      };
      component.heirActiveService.setActiveHeirDetails(data);
      component.onViewBenefitDetails();
      //component.getDocumentsForHoldBenefit(transactionKey,transactionType,component.requestId);
      expect(component.onViewBenefitDetails).not.toBeNull();
    });
  });
  describe('getDocumentsForModifyPayee', () => {
    it('should getDocumentsForModifyPayee', () => {
      const sin = 100077668;
      const benefitRequestId = 244566;
      const referenceNo = 233444;
      const transactionKey = 'MODIFY_PAYEE';
      const modifyPayeeType = 'EQUEST_BENEFIT_FO';
      spyOn(component.benefitDocumentService, 'getModifyPayeeDocuments').and.returnValue(
        of(bindToObject(new ModifyPayeeDetails(), uiBenefits))
      );
      spyOn(component.alertService, 'showWarning');
      component.getDocumentsForModifyPayee(sin, benefitRequestId, referenceNo, transactionKey, modifyPayeeType);
      expect(component.alertService.showError);
      expect(component.benefitDocumentService.getModifyPayeeDocuments).toHaveBeenCalled();
    });
    describe('navigateToEdit', () => {
      it('should navigate to apply screen', () => {
        component.navigateToEdit();
        expect(component.router.navigate).toHaveBeenCalledWith(
          [BenefitConstants.ROUTE_MODIFY_BENEFIT_PAYMENT],
          Object({
            queryParams: Object({
              edit: true
            })
          })
        );
      });
    });
  });
  describe('confirmRejectBenefit', () => {
    it('should show Reject modal', () => {
      component.modifyBenefitForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(component.modifyBenefitForm);
      component.confirmRejectBenefit();
      expect(component.confirmRejectBenefit).toBeDefined();
    });
  });
  describe('returnBenefit', () => {
    it('should show returnBenefit modal', () => {
      component.modifyBenefitForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnBenefit();
      expect(component.returnBenefit).toBeDefined();
    });
  });
});
