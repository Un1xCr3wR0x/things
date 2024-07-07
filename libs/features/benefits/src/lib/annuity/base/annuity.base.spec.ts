/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/*import { Component, NO_ERRORS_SCHEMA, Directive } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BenefitBaseScComponent, ValidateRequest, ManageBenefitService, AdjustmentDetailsDto, HeirHistoryDetails, HeirBenefitService, HeirHistory, DependentService, 
  DependentTransaction, BenefitDetails, SearchPersonalInformation, PersonalInformation, AttorneyDetailsWrapper, DependentDetails, BankService, CreditBalanceDetails, ContributorService } from '../../shared';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AnnuityBaseComponent } from './annuity.base-component';
import { LookupService, LovList } from '@gosi-ui/core';
import { bankDetailsByIBAN } from 'testing';
import { BankAccountList } from '@gosi-ui/features/payment/lib/shared';

/** Dummy component to test ValidatorBaseScComponent. 
@Directive({
  selector: '[annuitybasederived]'
})
export default class AnnuityBaseDerived extends AnnuityBaseComponent {}

describe('AnnuityBaseComponent', () => {
  let component: AnnuityBaseComponent;
  let fixture: ComponentFixture<AnnuityBaseComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAdjustmentDetails',
    'getBenefitCalculationDetailsByRequestId',
    'getPersonDetailsApi',
     'getPersonDetailsWithPersonId',
     'getAttorneyDetailsForId',
     'getContirbutorRefundDetails'
  ]);
  const heirBenefitServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirHistoryDetails'
  ]);
  const bankServiceSpy = jasmine.createSpyObj<BankService>('BankService', [
    'getBankAccountList'
  ]);
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistoryDetails',
    'getDependentDetails',
    'getBenefitHistory'
  ]);
  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', ['getBank']);
  const contributorDomainServiceeSpy = jasmine.createSpyObj<ContributorService>('contributorDomainService', ['getContributorByPersonId']);
  //bankServiceSpy.getBankAccountList.and.returnValue(of(new BankAccountList()));
  contributorDomainServiceeSpy.getContributorByPersonId.and.returnValues(of());
  lookupServiceSpy.getBank.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  manageBenefitServiceSpy.getAdjustmentDetails.and.returnValue(of(new AdjustmentDetailsDto()));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getPersonDetailsApi.and.returnValue(of(new SearchPersonalInformation()));
 manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(of(new PersonalInformation()));
 manageBenefitServiceSpy.getAttorneyDetailsForId.and.returnValue(of([{...new AttorneyDetailsWrapper()}]));
 manageBenefitServiceSpy.getContirbutorRefundDetails.and.returnValue(of(new CreditBalanceDetails()));
 dependentServiceSpy.getDependentHistoryDetails.and.returnValue(of([{...new DependentTransaction()}]));
 dependentServiceSpy.getBenefitHistory.and.returnValue(of([{...new BenefitDetails()}]));
  heirBenefitServiceSpy.getHeirHistoryDetails.and.returnValue(of([{...new HeirHistory()}]));

  //dependentServiceSpy.getDependentDetails.and.returnValue(of([{...new DependentDetails()}]));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AnnuityBaseComponent],
      providers: [
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnuityBaseDerived);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*describe('getAdjustmentDetails', () => {
    it('should getAdjustmentDetails', () => {
      const socialInsuranceNo = 230066639;
      const benefitRequestId = 1005229;
      component.manageBenefitService.getAdjustmentDetails(socialInsuranceNo, benefitRequestId);
      expect(component.getAdjustmentDetails).toBeDefined();
      expect(component.adjustmentDetails).not.toBeNull();
     
  });
});
describe('getHeirHistoryDetails', () => {
  it('should getHeirHistoryDetails', () => {
    component.socialInsuranceNo = 230066639;
    component.benefitRequestId = 1005229;
    component.referenceNo = 2345653453;
    component.getHeirHistoryDetails(component.socialInsuranceNo,component.referenceNo,component.benefitRequestId);
    expect(component.getHeirHistoryDetails).toBeDefined();
    expect(component.heirHistory).not.toBeNull();     
   });
  });
  describe('getDependentHistoryDetails', () => {
    it('should  getDependentHistoryDetails', () => {
      component.socialInsuranceNo = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 2345653453;
      component.getDependentHistoryDetails(component.socialInsuranceNo,component.referenceNo,component.benefitRequestId);
      expect(component.getDependentHistoryDetails).toBeDefined();
      expect(component.dependentHistory).not.toBeNull();     
     });
    });
    describe('getAnnuityCalculation', () => {
      it('should  getAnnuityCalculation', () => {
       const sin= 230066639;
        component.benefitRequestId = 1005229;
        component.referenceNo = 2345653453;
        component.getAnnuityCalculation(sin,component.referenceNo,component.benefitRequestId);
        expect(component.getAnnuityCalculation).toBeDefined();
        expect(component.benefitCalculation).not.toBeNull();     
       });
      });
      describe('getPersonContactDetails', () => {
        it('should  getPersonContactDetails', () => {
          component.nin = 230066639;
          component.getPersonContactDetails(component.nin);
          expect(component.getPersonContactDetails).toBeDefined();
          expect(component.personDetails).not.toBeNull();     
         });
        });
        describe('getPersonDetails', () => {
          it('should  getPersonDetails', () => {
            const getAuthPersons = true;
            component.getPersonDetails(getAuthPersons);
            expect(component.getPersonDetails).toBeDefined();
            expect(component.getAttorneyDetails).toBeDefined();
           });
          });
          describe('getAttorneyDetails', () => {
            it('should  getAttorneyDetails', () => {
              const status = "ACTIVE";
              const id = 1234556;
              component.getAttorneyDetails(id,status);
              expect(component.getAttorneyDetails).toBeDefined();
              expect(component.getAttorneyDetails).toBeDefined();
             });
            });
            describe('getBankName', () => {
              it('should  getBankName', () => {
                const bankcode = 123;
                component.getBankName(bankcode);
                expect(component.getBankName).toBeDefined();
                expect(component.bankName).not.toBeNull();     
               });
              });
              describe(' getBenefitHistoryDetails', () => {
                it('should  getBenefitHistoryDetails', () => {
                  const sin= 230066639;
                 component.benefitRequestId =  230066639;
                  component.getBenefitHistoryDetails(sin, component.benefitRequestId );
                  expect(component.getBenefitHistoryDetails).toBeDefined();
                  expect(component.historyBenefitDetails).not.toBeNull();     
                 });
                });
                describe('getContirbutorRefundDetails', () => {
                  it('should  getContirbutorRefundDetails', () => {
                    component.getContirbutorRefundDetails();
                    expect(component.getContirbutorRefundDetails).toBeDefined();
                    expect(component.creditBalanceDetails).not.toBeNull();     
                   });
                  });
});*/
