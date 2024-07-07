/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  LookupService,
  LanguageToken,
  BilingualText,
  Alert
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertServiceStub,
  ActivatedRouteStub,
  BilingualTextPipeMock,
  genericError,
  LookupServiceStub,
  DoctorServiceStub,
  MemberServiceStub,
  ModalServiceStub,
  unavailablePeriodMock
} from 'testing';
import { DoctorService, MemberService } from '../../../shared/services';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { Type } from '@angular/core';
import { convertToParamMap, ActivatedRoute, Router } from '@angular/router';
import { ViewContractHistoryScComponent } from './view-contract-history-sc.component';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ identificationNo: 2015767656 });

describe('ViewContractHistoryScComponent', () => {
  let component: ViewContractHistoryScComponent;
  let fixture: ComponentFixture<ViewContractHistoryScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      declarations: [ViewContractHistoryScComponent, BilingualTextPipeMock],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: DoctorService, useClass: DoctorServiceStub },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewContractHistoryScComponent);
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
        identificationNo: 2015767656,
        contractId: 1234
      })
    );
    activatedRouteStub.paramMap.subscribe(params => {
      component.identificationNo = +params.get('identificationNo');
      component.contractId = +params.get('contractId');
    });
    spyOn(component, 'getContractHistory').and.callThrough();
    component.ngOnInit();
    expect(component.getContractHistory).toHaveBeenCalled();
  });
  it('should throw error on getting member details', () => {
    spyOn(component.doctorService, 'getContractHistory').and.returnValue(throwError(genericError));
    spyOn(component, 'showError');
    component.getContractHistory(20157676562, 1);
    expect(component.showError).toHaveBeenCalled();
  });
  it('Should call showErrorMessage', () => {
    spyOn(component.alertService, 'showError');
    component.showError({ error: { message: new BilingualText(), details: [new Alert()] } });
    expect(component.alertService.showError).toHaveBeenCalled();
  });
});
