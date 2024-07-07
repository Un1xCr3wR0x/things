/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentService
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, throwError } from 'rxjs';
import { AlertServiceStub, ClaimsForm, genericErrorOh, OhMockService, DocumentServiceStub } from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { Route } from '../../../shared';
import { OhClaimsService } from '../../../shared/services/oh-claims.service';
import { ClaimsValidatorScComponent } from './claims-validator-sc.component';
describe('ClaimsValidatorScComponent', () => {
  let component: ClaimsValidatorScComponent;
  let fixture: ComponentFixture<ClaimsValidatorScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        BrowserDynamicTestingModule,
        ModalModule.forRoot()
      ],
      declarations: [ClaimsValidatorScComponent],
      providers: [
        FormBuilder,
        BsModalService,
        { provide: Router, useValue: routerSpy },
        { provide: OhClaimsService, useClass: OhMockService },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: RouterDataToken,
          useValue: new RouterData().fromJsonToObject(routerMockToken)
        },
        { provide: DocumentService, useClass: DocumentServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsValidatorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ClaimsValidatorScComponent', () => {
    it('should navigateTo', () => {
      const details = {
        type: 0,
        regNo: 601336235,
        sin: 1000602,
        injuryNo: 21324343,
        id: 234235346
      };
      component.navigateTo(details);
      expect(component.ohService.getRoute()).toEqual(Route.CLAIMS_VALIDATOR);
    });
    it('should navigateTo', () => {
      const details = {
        type: 1,
        regNo: 601336235,
        sin: 1000602,
        injuryNo: 21324343,
        id: 234235346
      };
      component.navigateTo(details);
      expect(component.diseaseIdMessage).toEqual('OCCUPATIONAL-HAZARD.ALLOWANCE.DISEASE-ID-MESSAGE');
    });
    it('should navigateTo', () => {
      const details = {
        type: 2,
        regNo: 601336235,
        sin: 1000602,
        injuryNo: 21324343,
        id: 234235346
      };
      component.navigateTo(details);
      expect(component.ohService.getRoute()).toEqual(Route.CLAIMS_VALIDATOR);
    });
    it('should assignForAudit', () => {
      component.modalRef = new BsModalRef();
      const form = new ClaimsForm();
      component.auditForm = form.createAuditForm();
      component.assignForAudit();
      expect(component.auditResponse).not.toEqual(null);
    });
    it('should throw error ', () => {
      spyOn(component.claimsService, 'assignAuditing').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.assignForAudit();
      expect(component.showError).toHaveBeenCalled();
    });
  });
});
