import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  RouterData,
  RouterDataToken,
  BilingualText,
  bindToObject
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  ModalServiceStub,
  SessionConfigurationServiceStub,
  medicalBoardForm,
  ActivatedRouteStub,
  genericError
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import {
  MBConstants,
  StopSessionDetails,
  SessionConfigurationService,
  HoldSessionDetails,
  MbRouteConstants
} from '../../../../shared';
import { SessionConfigurationDetailsScComponent } from './session-configuration-details-sc.component';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
describe('SessionConfigurationDetailsScComponent', () => {
  let component: SessionConfigurationDetailsScComponent;
  let fixture: ComponentFixture<SessionConfigurationDetailsScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [SessionConfigurationDetailsScComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: SessionConfigurationService, useClass: SessionConfigurationServiceStub },
        DatePipe
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(SessionConfigurationDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('test suite to stop session ', () => {
    it('It should stop session', () => {
      const stopSessionObject = new StopSessionDetails();
      const templateId = 1234;
      const response = {
        arabic: 'success',
        english: 'sucess'
      };
      const forms = new medicalBoardForm();
      const stopSessionForm = forms.createStopSessionForm();
      component.stopSessionForm.updateValueAndValidity();
      component.stopSessionForm.addControl('stopSessionForm', stopSessionForm);
      component.templateId = templateId;
      component.sessionType = 'Regular';
      spyOn(component.configurationService, 'onStopMbSession').and.returnValue(
        of(bindToObject(new BilingualText(), response))
      );
      component.stopSession(stopSessionObject);
      expect(component.stopSessionForm).toBeTruthy();
      expect(component.configurationService.onStopMbSession).toHaveBeenCalled();
    });
  });
  describe('test suite to hold Session', () => {
    it('It should hold session', () => {
      const holdSessionObject = new HoldSessionDetails();
      const form = new medicalBoardForm();
      const stopSessionForm = form.createStopSessionForm();
      const holdSessionForm = form.createHoldSessionForm();
      stopSessionForm.addControl('holdSessionForm', holdSessionForm);
      const templateId = 1234;
      const response = {
        arabic: 'success',
        english: 'success'
      };
      component.templateId = templateId;
      component.sessionType = 'Regular';
      component.stopSessionForm = stopSessionForm;
      spyOn(component.alertService, 'showSuccess').and.callThrough();
      spyOn(component.configurationService, 'onHoldMbSession').and.returnValue(
        of(bindToObject(new BilingualText(), response))
      );
      component.holdSession(holdSessionObject);
      expect(component.configurationService.onHoldMbSession).toHaveBeenCalled();
    });
    it('It should hold session', () => {
      const holdSessionObject = new HoldSessionDetails();
      const form = new medicalBoardForm();
      const stopSessionForm = form.createStopSessionForm();
      const holdSessionForm = form.createHoldSessionForm();
      stopSessionForm.addControl('holdSessionForm', holdSessionForm);
      const templateId = 1234;
      component.templateId = templateId;
      component.sessionType = 'Regular';
      component.stopSessionForm = stopSessionForm;
      component.modalRef = new BsModalRef();
      spyOn(component.configurationService, 'onHoldMbSession').and.returnValue(throwError(genericError));
      spyOn(component, 'hideModal').and.callThrough();
      spyOn(component.alertService, 'showError').and.callThrough();
      component.holdSession(holdSessionObject);
      // expect(component.alertService.showError).toHaveBeenCalled();
      expect(component.hideModal).toHaveBeenCalled();
    });
  });
  describe('test suite to remove Hold session ', () => {
    it('It should remove Hold session', () => {
      const removeSessionObject = new HoldSessionDetails();
      const templateId = 1234;
      const response = {
        arabic: 'success',
        english: 'sucess'
      };
      component.templateId = templateId;
      component.sessionType = 'Regular';
      spyOn(component.alertService, 'showSuccess').and.callThrough();
      spyOn(component.configurationService, 'removeHoldSession').and.returnValue(
        of(bindToObject(new BilingualText(), response))
      );
      component.removeHold(removeSessionObject);
      expect(component.alertService.showSuccess).toHaveBeenCalled();
      expect(component.configurationService.removeHoldSession).toHaveBeenCalled();
    });
  });
  describe('showModal', () => {
    it('should show modal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.modalRef = new BsModalRef();
      component.stopSessionPopup(modalRef);
      expect(component.modalRef).not.toEqual(null);
    });
  });
  describe('hideModal', () => {
    it('should show modal', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.hideModal();
      expect(component.modalRef.hide).toHaveBeenCalled();
    });
  });
  it('It should navigate to regular session', () => {
    const id = 1;
    const template = { elementRef: null, createEmbeddedView: null };
    component.isRegular = true;
    component.router.navigate([MBConstants.MODIFY_REGULAR_SESSION_ROUTE]);
    component.navigateToSession(id, template);
    expect(component.router.navigate).toBeDefined();
    expect(component.isRegular).toEqual(true);
  });
  it('should navigateToAddMembers', () => {
    component.navigateBack();
    expect(component.router.navigate).toHaveBeenCalledWith([MBConstants.ROUTE_MEDICAL_BOARD_SESSION_DETAILS]);
  });
  it('should navigateTo', () => {
    component.navigateTo(123123);
    expect(component.router.navigate).toHaveBeenCalledWith([MbRouteConstants.ROUTE_PROFILE_PERSON_DETAILS(123123)]);
  });
  it('should show pop up', () => {
    spyOn(component.modalService, 'show');
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.holdSessionPopup(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });
  it('should show pop up', () => {
    spyOn(component.modalService, 'show');
    const modalRef = { elementRef: null, createEmbeddedView: null };
    component.modalRef = new BsModalRef();
    component.holdSessionPopup(modalRef);
    expect(component.modalService.show).toHaveBeenCalled();
  });
  it('shouldgetHoldDetails', () => {
    const templateValues = { modal: { elementRef: null, createEmbeddedView: null }, size: 'lg' };
    spyOn(component, 'holdSessionPopup');
    component.getHoldDetails(templateValues);
    expect(component.holdSessionPopup).toHaveBeenCalled();
  });
  it('It should navigate to adhoc session', () => {
    const id = 1;
    const template = { elementRef: null, createEmbeddedView: null };
    component.isRegular = false;
    component.router.navigate([MBConstants.MODIFY_ADHOC_SESSION_ROUTE]);
    component.navigateToSession(id, template);
    expect(component.router.navigate).toBeDefined();
    expect(component.isRegular).not.toEqual(true);
  });
  it('It should navigate to non regular session', () => {
    const id = 23;
    const template = { elementRef: null, createEmbeddedView: null };
    spyOn(component, 'stopSessionPopup').and.callThrough();
    component.navigateToSession(id, template);
    expect(component.stopSessionPopup).toHaveBeenCalled;
  });
});
