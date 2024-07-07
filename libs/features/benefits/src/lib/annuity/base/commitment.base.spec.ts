/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

/*import { Component, NO_ERRORS_SCHEMA, Directive } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  BenefitBaseScComponent,
  ValidateRequest,
  ManageBenefitService,
  AdjustmentDetailsDto,
  HeirHistoryDetails,
  HeirBenefitService,
  HeirHistory,
  DependentService,
  DependentTransaction,
  BenefitDetails,
  SearchPersonalInformation,
  PersonalInformation,
  AttorneyDetailsWrapper,
  DependentDetails,
  BankService,
  CreditBalanceDetails,
  ContributorService
} from '../../shared';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AnnuityBaseComponent } from './annuity.base-component';
import { LookupService, LovList } from '@gosi-ui/core';
import { bankDetailsByIBAN } from 'testing';
import { BankAccountList } from '@gosi-ui/features/payment/lib/shared';
import { HeirBaseComponent } from './heir.base-component';
import { CommitmentBaseComponent } from './commitment-base-component';

/** Dummy component to test ValidatorBaseScComponent. */
/*@Directive({
  selector: '[commitmentbasederived]'
})
export default class CommitmentBaseDerived extends CommitmentBaseComponent {}

describe('HeirBaseComponent ', () => {
  let component: CommitmentBaseComponent;
  let fixture: ComponentFixture<CommitmentBaseComponent>;
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
  const bankServiceSpy = jasmine.createSpyObj<BankService>('BankService', ['getBankAccountList']);
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistoryDetails',
    'getDependentDetails',
    'getBenefitHistory'
  ]);
  const lookupServiceSpy = jasmine.createSpyObj<LookupService>('LookupService', ['getBank']);
  const contributorDomainServiceeSpy = jasmine.createSpyObj<ContributorService>('contributorDomainService', [
    'getContributorByPersonId'
  ]);
  //bankServiceSpy.getBankAccountList.and.returnValue(of(new BankAccountList()));
  contributorDomainServiceeSpy.getContributorByPersonId.and.returnValues(of());
  lookupServiceSpy.getBank.and.returnValue(of(<LovList>new LovList([bankDetailsByIBAN])));
  manageBenefitServiceSpy.getAdjustmentDetails.and.returnValue(of(new AdjustmentDetailsDto()));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getPersonDetailsApi.and.returnValue(of(new SearchPersonalInformation()));
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(of(new PersonalInformation()));
  manageBenefitServiceSpy.getAttorneyDetailsForId.and.returnValue(of([{ ...new AttorneyDetailsWrapper() }]));
  manageBenefitServiceSpy.getContirbutorRefundDetails.and.returnValue(of(new CreditBalanceDetails()));
  dependentServiceSpy.getDependentHistoryDetails.and.returnValue(of([{ ...new DependentTransaction() }]));
  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  heirBenefitServiceSpy.getHeirHistoryDetails.and.returnValue(of([{ ...new HeirHistory() }]));

  //dependentServiceSpy.getDependentDetails.and.returnValue(of([{...new DependentDetails()}]));
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [CommitmentBaseComponent],
      providers: [{ provide: ManageBenefitService, useValue: manageBenefitServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentBaseDerived);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*it('should create', () => {
    expect(component).toBeTruthy();
});
});*/
