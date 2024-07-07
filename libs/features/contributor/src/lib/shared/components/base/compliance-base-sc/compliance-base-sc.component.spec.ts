/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { AlertServiceStub, engagementData, establishmentData, getContributorData, violationRequest } from 'testing';
import { Establishment } from '../../../models';
import {
  ContractAuthenticationService,
  ContributorService,
  EngagementService,
  EstablishmentService
} from '../../../services';
import { ComplianceBaseScComponent } from './compliance-base-sc.component';

@Component({ selector: 'cnt-compliance-sc-derived' })
export class ComplianceDerived extends ComplianceBaseScComponent {
  constructor(
    alertService: AlertService,
    @Inject(ApplicationTypeToken) appToken: string,
    contractAuthenticationService: ContractAuthenticationService,
    contributorService: ContributorService,
    establishmentService: EstablishmentService,
    engagementService: EngagementService,
    @Inject(RouterDataToken) routerDataToken: RouterData,
    @Inject(LanguageToken) language: BehaviorSubject<string>,
    router: Router
  ) {
    super(
      alertService,
      appToken,
      contractAuthenticationService,
      contributorService,
      establishmentService,
      engagementService,
      routerDataToken,
      language,
      router
    );
  }
}
describe('ComplianceBaseScComponent', () => {
  let component: ComplianceDerived;
  let fixture: ComponentFixture<ComplianceDerived>;
  const routerSpy = {
    url: 'home/contributor/valdator/modify-violation',
    navigate: jasmine.createSpy('navigate'),
    routerState: {
      root: {
        data: { title: 'Title' }
      }
    }
  };
  const contributorServiceSpy = jasmine.createSpyObj<ContributorService>('ContributorService', ['getContributor']);
  contributorServiceSpy.getContributor.and.returnValue(of(<any>getContributorData));
  const contractServiceSpy = jasmine.createSpyObj<ContractAuthenticationService>('ContractAuthenticationService', [
    'getViolationRequest'
  ]);
  contractServiceSpy.getViolationRequest.and.returnValue(of(<any>{ violationRequest }));
  const establishmentServiceSpy = jasmine.createSpyObj<EstablishmentService>('EstablishmentService', [
    'getEstablishmentDetails'
  ]);
  establishmentServiceSpy.getEstablishmentDetails.and.returnValue(of(<Establishment>(<any>establishmentData)));
  const engagementServiceSpy = jasmine.createSpyObj<EngagementService>('EngagementService', ['getEngagementDetails']);
  engagementServiceSpy.getEngagementDetails.and.returnValue(of(<any>engagementData));
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [ComplianceDerived],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: EstablishmentService, useValue: establishmentServiceSpy },
        { provide: EngagementService, useValue: engagementServiceSpy },
        { provide: ContributorService, useValue: contributorServiceSpy },
        { provide: ContractAuthenticationService, useValue: contractServiceSpy },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceDerived);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
