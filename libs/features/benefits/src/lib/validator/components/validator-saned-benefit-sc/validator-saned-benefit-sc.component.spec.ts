/*import { ComponentFixture, TestBed } from '@angular/core/testing';

//import { ValidatorSanedBenefitScComponent } from './validator-saned-benefit-sc.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiBenefitsService, Benefits, AdjustmentService, SanedBenefitService, ManageBenefitService, HeirBenefitService, DependentService, BenefitDocumentService } from '../../../shared';
import { bindToObject, RouterDataToken, RouterData, DocumentService, ApplicationTypeToken, LanguageToken, EnvironmentToken } from '@gosi-ui/core';
import { of, BehaviorSubject } from 'rxjs';
import { uiBenefits, ModalServiceStub, ManagePersonServiceStub } from 'testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal/public_api';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { ValidatorSanedBenefitScComponent } from '..';

describe('ValidatorSanedBenefitScComponent', () => {
  let component: ValidatorSanedBenefitScComponent;
  let fixture: ComponentFixture<ValidatorSanedBenefitScComponent>;
  const uiBenefitServiceSpy = jasmine.createSpyObj<UiBenefitsService>('UiBenefitsService', [
    'getEligibleUiBenefitByType'
  ]);
  const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('put') };
  uiBenefitServiceSpy.getEligibleUiBenefitByType.and.returnValue(
    of(bindToObject(new Benefits(), uiBenefits))
  );
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ ValidatorSanedBenefitScComponent ],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: HttpClient, useValue: httpSpy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: UiBenefitsService, useValue: uiBenefitServiceSpy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorSanedBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
