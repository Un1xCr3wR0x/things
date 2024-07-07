/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  LookupService,
  RouterData,
  RouterDataToken,
  bindToForm,
  bindToObject,
  MenuService
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, throwError, of } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  OhMockService,
  Form,
  genericErrorOh,
  ClaimsForm,
  complicationDetailsTestData,
  injuryDetailsTestData,
  MenuServiceStub
} from 'testing';
import { ProgressWizardDcMockComponent, TabsMockComponent } from 'testing/mock-components';
import { TabSetVariables } from '../../enums';
import { ClaimsService } from '../../models/claims-service';
import { OhService } from '../../services';
import { TabsetScComponent } from './tabset-sc.component';
import { ComplicationWrapper, InjuryWrapper } from '../../models';
import { OhClaimsService } from '../../services/oh-claims.service';
let activatedRoute: ActivatedRouteStub;
activatedRoute = new ActivatedRouteStub();
activatedRoute.setParamMap({
  registrationNo: 12334,
  socialInsuranceNo: 3455,
  injuryId: 56789,
  injuryNo: 56789,
  complicationId: 56789
});
activatedRoute.setQueryParams({ status: true });
describe('TabsetScComponent', () => {
  let component: TabsetScComponent;
  let fixture: ComponentFixture<TabsetScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ModalModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [TabsetScComponent, ProgressWizardDcMockComponent, TabsMockComponent],
      providers: [
        FormBuilder,
        BsModalService,
        BsModalRef,
        {
          provide: ProgressWizardDcComponent,
          useClass: ProgressWizardDcMockComponent
        },
        { provide: TabsetComponent, useClass: TabsMockComponent },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: OhService, useClass: OhMockService },
        {
          provide: MenuService,
          useClass: MenuServiceStub
        },
        { provide: ClaimsService, useClass: OhMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute
        },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: OhClaimsService, useClass: OhMockService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TabsetScComponent);
    component = fixture.componentInstance;
    spyOn(component.router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getDetails', () => {
    it('should getDetails', () => {
      spyOn(component.complicationService, 'getComplication').and.returnValue(
        of(bindToObject(new ComplicationWrapper(), complicationDetailsTestData))
      );
      component.getDetails();
      expect(component.complicationDetails).not.toEqual(null);
    });
  });
  describe('getDetails', () => {
    it('should getDetails', () => {
      component.complicationId = null;
      spyOn(component.injuryService, 'getInjuryDetails').and.returnValue(
        of(bindToObject(new InjuryWrapper(), injuryDetailsTestData))
      );
      component.getDetails();
      expect(component.injury).not.toEqual(null);
    });
  });
  describe('selectTab', () => {
    it('should selectTab', () => {
      component.selectTab(TabSetVariables.Injury);
      expect(component.selectedId).toEqual(TabSetVariables.Injury);
    });
  });
  describe('selectTab', () => {
    it('should selectTab', () => {
      component.alertService.showSuccessByKey('CORE.ERROR.SCAN-MANDATORY-DOCUMENTS');
      component.selectTab(TabSetVariables.Allowance);
      expect(component.selectedId).toEqual(TabSetVariables.Allowance);
    });
  });
  describe('selectTab', () => {
    it('should selectTab', () => {
      component.selectTab(TabSetVariables.Claims);
      expect(component.selectedId).toEqual(TabSetVariables.Claims);
    });
  });
  describe('selectTab', () => {
    it('should selectTab', () => {
      component.complicationId = null;
      component.selectTab(TabSetVariables.Claims);
      expect(component.selectedId).toEqual(TabSetVariables.Claims);
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      spyOn(component.alertService, 'clearAlerts');
      component.routeBack();
      expect(component.alertService.clearAlerts).toHaveBeenCalled();
    });
  });
  describe('clearAlerts', () => {
    it('should clearAlerts', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.clear();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
});
