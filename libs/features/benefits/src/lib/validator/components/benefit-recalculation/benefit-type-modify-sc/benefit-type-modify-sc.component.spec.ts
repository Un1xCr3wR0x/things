import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  LookupService,
  GosiCalendar,
  BilingualText
} from '@gosi-ui/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, TranslateLoaderStub, LookupServiceStub } from 'testing';
import { BenefitTypeModifyScComponent } from './benefit-type-modify-sc.component';
//import { ManageBenefitService, AnnuityResponseDto, BenefitRecalculation, SearchPersonalInformation, PersonalInformation, BenefitResponse, BenefitDetails } from '../../../..';
import {
  ManageBenefitService,
  AnnuityResponseDto,
  BenefitRecalculation,
  SearchPersonalInformation,
  PersonalInformation,
  BenefitResponse,
  BenefitDetails,
  DependentService,
  DependentSetValues,
  DependentDetails
} from '../../../../shared';

const customDate = {
  gregorian: new Date('2021-04-10T00:00:00.000Z'),
  hijiri: '1442-08-28',
  entryFormat: 'GREGORIAN'
};
describe('BenefitTypeModifyScComponent', () => {
  let component: BenefitTypeModifyScComponent;
  let fixture: ComponentFixture<BenefitTypeModifyScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getBenefitDetails',
    'getBenefitRecalculation',
    'getSystemParams',
    'getSystemRunDate',
    'getPersonDetailsApi',
    'getModificationReason',
    'updateForAnnuityBenefit',
    'patchAnnuityBenefit',
    'getBenefitCalculationDetailsByRequestId'
  ]);
  manageBenefitServiceSpy.getBenefitDetails.and.returnValue(
    of({
      ...new AnnuityResponseDto(),
      benefitType: { english: '', arabic: '' },
      dateOfBirth: { ...new GosiCalendar(), entryFormat: 'GREGORIAN' },
      nin: 123456
    })
  );
  manageBenefitServiceSpy.getBenefitRecalculation.and.returnValue(of(new BenefitRecalculation()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([{ name: '', value: '' }]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getPersonDetailsApi.and.returnValue(
    of({
      ...new SearchPersonalInformation(),
      listOfPersons: [
        {
          ...new PersonalInformation(),
          sex: { english: '', arabic: '' },
          personId: 1234,
          fromJsonToObject: json => json
        }
      ]
    })
  );
  manageBenefitServiceSpy.getModificationReason.and.returnValue(of([{ english: '', arabic: '' }]));
  manageBenefitServiceSpy.updateForAnnuityBenefit.and.returnValue(
    of({ ...new BenefitResponse(), benefitRequestId: 1234, referenceNo: 1234 })
  );
  manageBenefitServiceSpy.patchAnnuityBenefit.and.returnValue(
    of({ ...new BenefitResponse(), benefitRequestId: 1234, referenceNo: 1234, message: { english: '', arabic: '' } })
  );
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [BenefitTypeModifyScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitTypeModifyScComponent);
    component = fixture.componentInstance;
    component.parentForm = new FormGroup({
      requestDate: new FormGroup({
        gregorian: new FormControl({
          value: customDate.gregorian
        })
      })
    });
    component.benefitsForm = new FormGroup({
      imprisonmentForm: new FormGroup({
        enteringDate: new FormControl({ value: customDate }),
        releaseDate: new FormControl({ value: customDate }),
        prisoner: new FormControl({ value: true }),
        hasCertificate: new FormGroup({ english: new FormControl({ value: 'Yes' }) })
      }),
      requestDate: new FormGroup({
        gregorian: new FormControl({
          value: customDate.gregorian
        })
      })
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should searchBenefit', () => {
    spyOn(component, 'getDependents');
    component.searchBenefit({ identifier: 1234, requestId: 1234 });
    expect(component.currentBenefits).not.toEqual(null);
  });
  it('should savePaymentDetails', () => {
    component.iban = 'SA1234';
    component.bankNameList = { value: { english: '', arabic: '' }, sequence: 1 };
    component.listOfDependents = [];
    component.identifier = component.benefitId = 1234;
    spyOn(component, 'nextTab');
    component.savePaymentDetails();
    expect(component.benefitResponse).not.toEqual(null);
  });
  it('should saveBenefitType', () => {
    spyOn(component, 'nextTab');
    component.saveBenefitType({ english: '', arabic: '' });
    expect(component.benefitType).not.toEqual(null);
  });
  it('Should navigate to next tab ', () => {
    component.currentTab = 0;
    spyOn(component.alertService, 'clearAlerts');
    component.nextTab();
    expect(component.currentTab).toEqual(1);
  });
  it('should submitTransaction', () => {
    component.identifier = 1234;
    component.benefitResponse = { ...new BenefitResponse(), benefitRequestId: 1234, referenceNo: 1234 };
    spyOn(component, 'showSuccessMessage');
    component.submitTransaction('');
    expect(component.showSuccessMessage).toHaveBeenCalled();
  });
});
