import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReimbursementDetailsScComponent } from './reimbursement-details-sc.component';
import {
  ApplicationTypeToken,
  ApplicationTypeEnum,
  DocumentService,
  AlertService,
  LanguageToken,
  RouterDataToken,
  RouterData,
  LookupService,
  AuthTokenService
} from '@gosi-ui/core';
import {
  ModalServiceStub,
  DocumentServiceStub,
  InjuryMockService,
  ComplicationMockService,
  ContributorMockService,
  AlertServiceStub,
  EstablishmentMockService,
  OhMockService,
  LookupServiceStub,
  AuthTokenServiceStub
} from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import {
  InjuryService,
  ComplicationService,
  ContributorService,
  EstablishmentService,
  OhService
} from '../../../shared';
import { BehaviorSubject } from 'rxjs';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('ReimbursementDetailsScComponent', () => {
  let component: ReimbursementDetailsScComponent;
  let fixture: ComponentFixture<ReimbursementDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReimbursementDetailsScComponent],
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: LookupService, useValue: LookupServiceStub },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: OhService, useClass: OhMockService },
        { provide: OhClaimsService, useClass: OhMockService },
        FormBuilder,
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: ContributorService, useClass: ContributorMockService },
        { provide: EstablishmentService, useClass: EstablishmentMockService },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: AuthTokenService, useClass: AuthTokenServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
