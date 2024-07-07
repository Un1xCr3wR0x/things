import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeEnum, ApplicationTypeToken, bindToObject, RouterData, RouterDataToken } from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  ModalServiceStub,
  RegularSessionForms,
  CreateSessionServiceStub,
  genericError,
  individualSessionData,
  ActivatedRouteStub
} from 'testing';
import { routerMockToken } from 'testing/mock-services/core/tokens/router-token';
import { CreateRegularSessionScComponent } from './create-regular-session-sc.component';
import { CreateSessionService, IndividualSessionDetails, MbDetails, SessionDetails } from '../../../shared';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

describe('CreateRegularSessionScComponent', () => {
  let component: CreateRegularSessionScComponent;
  let fixture: ComponentFixture<CreateRegularSessionScComponent>;
  let spy: jasmine.Spy;
  const routerSpy = { url: '/edit', navigate: jasmine.createSpy('navigate') };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [CreateRegularSessionScComponent],
      providers: [
        DatePipe,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: RouterDataToken, useValue: new RouterData().fromJsonToObject(routerMockToken) },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: CreateSessionService, useClass: CreateSessionServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(CreateRegularSessionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('onCreateSession', () => {
    it('should onCreateSession', () => {
      component.isPrimaryMedicalBoard = true;
      component.isEditMode = true;
      const forms = new RegularSessionForms();
      component.regularSessionForm = forms.SessionForm();
      component.regularSessionForm.updateValueAndValidity();
      component.regularSessionForm.get('invitationForm').get('doctorAcceptance').get('english').setValue('yes');
      component.regularSessionForm.get('invitationForm').get('noOfCancellationDays').setValue(2);
      component.regularSessionForm.get('invitationForm').get('noOfInvitationDays').setValue(4);
      component.regularSessionForm.get('inviteForm').get('day').get('sunday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('monday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('tuesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('wednesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('thursday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('friday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('saturday').setValue(true);
      component.regularSessionForm
        .get('inviteForm')
        .get('medicalBoardList')
        .get('english')
        .setValue('Primary Medical Board');
      component.regularSessionForm.get('inviteForm').get('officeLocation').get('english').setValue('Riyadh');
      component.regularSessionForm.get('inviteForm').get('sessionChannelList').get('english').setValue('GOSI Office');
      component.regularSessionForm.get('inviteForm').get('sessionFrequency').get('english').setValue('Every week');
      component.regularSessionForm
        .get('inviteForm')
        .get('startDate')
        .get('gregorian')
        .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
      component.regularSessionForm.get('inviteForm').get('startTimePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('inviteForm').get('startTimePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('inviteForm').get('timePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('inviteForm').get('timePicker').get('injuryMinute').setValue('01');
      (component.regularSessionForm.get('medicalForm') as FormArray).controls[0]
        .get('speciality')
        .get('english')
        .setValue('cardiac');
      component.regularSessionForm.get('sessionDetails').get('day').get('sunday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('monday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('tuesday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('wednesday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('thursday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('friday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('saturday').setValue(true);
      component.regularSessionForm
        .get('sessionDetails')
        .get('medicalBoardList')
        .get('english')
        .setValue('Primary Medical Board');
      component.regularSessionForm.get('sessionDetails').get('officeLocation').get('english').setValue('Riyadh');
      component.regularSessionForm
        .get('sessionDetails')
        .get('sessionChannelList')
        .get('english')
        .setValue('GOSI Office');
      component.regularSessionForm.get('sessionDetails').get('sessionFrequency').get('english').setValue('Every week');
      component.regularSessionForm
        .get('sessionDetails')
        .get('startDate')
        .get('gregorian')
        .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
      component.regularSessionForm.get('sessionDetails').get('startTimePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('startTimePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('timePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('timePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionDays').setValue(5);
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionPriorDays').setValue(2);
      component.regularSessionForm.get('sessionSlotForm').get('noOfbeneficiaries').setValue(4);
      component.onCreateSession();
      expect(component.regularSessionForm).not.toEqual(null);
      expect(component.regularSessionForm.valid).toBeTruthy();
      expect(component.regularSessionForm.value).not.toEqual(null);
    });
    it('should onCreateSession', () => {
      component.isPrimaryMedicalBoard = true;
      component.isEditMode = true;
      const forms = new RegularSessionForms();
      component.regularSessionForm = forms.SessionForm();
      component.regularSessionForm.updateValueAndValidity();
      component.regularSessionForm.get('invitationForm').get('doctorAcceptance').get('english').setValue(null);
      component.regularSessionForm.get('invitationForm').get('noOfCancellationDays').setValue(2);
      component.regularSessionForm.get('invitationForm').get('noOfInvitationDays').setValue(4);
      component.regularSessionForm.get('inviteForm').get('day').get('sunday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('monday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('tuesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('wednesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('thursday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('friday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('saturday').setValue(true);
      (component.regularSessionForm.get('medicalForm') as FormArray).controls[0]
        .get('speciality')
        .get('english')
        .setValue('cardiac');
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionDays').setValue(5);
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionPriorDays').setValue(2);
      component.regularSessionForm.get('sessionSlotForm').get('noOfbeneficiaries').setValue(4);
      component.onCreateSession();
      expect(component.regularSessionForm).not.toEqual(null);
      expect(component.regularSessionForm.value).not.toEqual(null);
    });
    it('should onCreateSession', () => {
      component.isPrimaryMedicalBoard = true;
      component.isEditMode = true;
      const forms = new RegularSessionForms();
      component.regularSessionForm = forms.SessionForm();
      component.regularSessionForm.updateValueAndValidity();
      component.regularSessionForm.get('invitationForm').get('doctorAcceptance').get('english').setValue('yes');
      component.regularSessionForm.get('invitationForm').get('noOfCancellationDays').setValue(2);
      component.regularSessionForm.get('invitationForm').get('noOfInvitationDays').setValue(4);
      component.regularSessionForm.get('inviteForm').get('day').get('sunday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('monday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('tuesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('wednesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('thursday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('friday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('saturday').setValue(true);
      component.regularSessionForm
        .get('inviteForm')
        .get('medicalBoardList')
        .get('english')
        .setValue('Primary Medical Board');
      component.regularSessionForm.get('inviteForm').get('officeLocation').get('english').setValue('Riyadh');
      component.regularSessionForm.get('inviteForm').get('sessionChannelList').get('english').setValue('GOSI Office');
      component.regularSessionForm.get('inviteForm').get('sessionFrequency').get('english').setValue('Every week');
      component.regularSessionForm
        .get('inviteForm')
        .get('startDate')
        .get('gregorian')
        .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
      component.regularSessionForm.get('inviteForm').get('startTimePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('inviteForm').get('startTimePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('inviteForm').get('timePicker').get('injuryHour').setValue('03');
      component.regularSessionForm.get('inviteForm').get('timePicker').get('injuryMinute').setValue('03');
      (component.regularSessionForm.get('medicalForm') as FormArray).controls[0]
        .get('speciality')
        .get('english')
        .setValue('cardiac');
      component.regularSessionForm.get('sessionDetails').get('day').get('sunday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('monday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('tuesday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('wednesday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('thursday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('friday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('saturday').setValue(true);
      component.regularSessionForm
        .get('sessionDetails')
        .get('medicalBoardList')
        .get('english')
        .setValue('Primary Medical Board');
      component.regularSessionForm.get('sessionDetails').get('officeLocation').get('english').setValue('Riyadh');
      component.regularSessionForm
        .get('sessionDetails')
        .get('sessionChannelList')
        .get('english')
        .setValue('GOSI Office');
      component.regularSessionForm.get('sessionDetails').get('sessionFrequency').get('english').setValue('Every week');
      component.regularSessionForm
        .get('sessionDetails')
        .get('startDate')
        .get('gregorian')
        .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
      component.regularSessionForm.get('sessionDetails').get('startTimePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('startTimePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('timePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('timePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionDays').setValue(5);
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionPriorDays').setValue(2);
      component.regularSessionForm.get('sessionSlotForm').get('noOfbeneficiaries').setValue(4);

      spyOn(component.sessionService, 'updateRegularMedicalBoardSession').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.onCreateSession();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should onCreateSession', () => {
      component.isPrimaryMedicalBoard = false;
      component.isEditMode = false;
      const forms = new RegularSessionForms();
      component.regularSessionForm = forms.SessionForm();
      component.regularSessionForm.updateValueAndValidity();
      component.regularSessionForm.get('invitationForm').get('doctorAcceptance').get('english').setValue('yes');
      component.regularSessionForm.get('invitationForm').get('noOfCancellationDays').setValue(2);
      component.regularSessionForm.get('invitationForm').get('noOfInvitationDays').setValue(4);
      component.regularSessionForm.get('inviteForm').get('day').get('sunday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('monday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('tuesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('wednesday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('thursday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('friday').setValue(true);
      component.regularSessionForm.get('inviteForm').get('day').get('saturday').setValue(true);
      component.regularSessionForm
        .get('inviteForm')
        .get('medicalBoardList')
        .get('english')
        .setValue('Primary Medical Board');
      component.regularSessionForm.get('inviteForm').get('officeLocation').get('english').setValue('Riyadh');
      component.regularSessionForm.get('inviteForm').get('sessionChannelList').get('english').setValue('GOSI Office');
      component.regularSessionForm.get('inviteForm').get('sessionFrequency').get('english').setValue('Every week');
      component.regularSessionForm
        .get('inviteForm')
        .get('startDate')
        .get('gregorian')
        .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
      component.regularSessionForm.get('inviteForm').get('startTimePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('inviteForm').get('startTimePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('inviteForm').get('timePicker').get('injuryHour').setValue('03');
      component.regularSessionForm.get('inviteForm').get('timePicker').get('injuryMinute').setValue('03');
      (component.regularSessionForm.get('medicalForm') as FormArray).controls[0]
        .get('speciality')
        .get('english')
        .setValue('cardiac');
      component.regularSessionForm.get('sessionDetails').get('day').get('sunday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('monday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('tuesday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('wednesday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('thursday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('friday').setValue(true);
      component.regularSessionForm.get('sessionDetails').get('day').get('saturday').setValue(true);
      component.regularSessionForm
        .get('sessionDetails')
        .get('medicalBoardList')
        .get('english')
        .setValue('Primary Medical Board');
      component.regularSessionForm.get('sessionDetails').get('officeLocation').get('english').setValue('Riyadh');
      component.regularSessionForm
        .get('sessionDetails')
        .get('sessionChannelList')
        .get('english')
        .setValue('GOSI Office');
      component.regularSessionForm.get('sessionDetails').get('sessionFrequency').get('english').setValue('Every week');
      component.regularSessionForm
        .get('sessionDetails')
        .get('startDate')
        .get('gregorian')
        .setValue('Wed Dec 01 2021 16:09:45 GMT+0300 (Arabian Standard Time)');
      component.regularSessionForm.get('sessionDetails').get('startTimePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('startTimePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('timePicker').get('injuryHour').setValue('01');
      component.regularSessionForm.get('sessionDetails').get('timePicker').get('injuryMinute').setValue('01');
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionDays').setValue(5);
      component.regularSessionForm.get('sessionSlotForm').get('noOfSessionPriorDays').setValue(2);
      component.regularSessionForm.get('sessionSlotForm').get('noOfbeneficiaries').setValue(4);

      spyOn(component.sessionService, 'registerMedicalBoardSession').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.onCreateSession();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('getIndividualSessionDetails', () => {
    it('should getIndividualSessionDetails', () => {
      const templateId = 45;
      const sessionType = 'Regular';
      spyOn(component.configurationService, 'getIndividualSessionDetails').and.returnValue(
        of(bindToObject(new IndividualSessionDetails(), individualSessionData))
      );
      component.getSessionInWorkflow(templateId, sessionType);
      expect(component.configurationService.getIndividualSessionDetails).toHaveBeenCalled();
    });
    it('should throw error for getIndividualSessionDetails', () => {
      const templateId = 45;
      const sessionType = 'Regular';
      spyOn(component.alertService, 'showError').and.callThrough();
      spyOn(component.configurationService, 'getIndividualSessionDetails').and.returnValue(throwError(genericError));
      component.getSessionInWorkflow(templateId, sessionType);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('set invitation', () => {
    it('should set invitation', () => {
      const value = 14;
      component.setInvitationDate(value);
      expect(component).toBeTruthy();
    });
  });
  describe('get session difference', () => {
    it('should session difference', () => {
      const value = 7;
      component.getSessionDifference(value);
      expect(component).toBeTruthy();
    });
  });

  describe('getMbDetails', () => {
    it('should get Session Details', () => {
      spyOn(component.sessionService, 'getMbDetails').and.returnValue(of(new MbDetails()));
      component.getMbDetails();
      expect(component.sessionService.getMbDetails).toHaveBeenCalled();
    });
    it('should throw error', () => {
      spyOn(component.alertService, 'showError');
      spyOn(component.sessionService, 'getMbDetails').and.returnValue(throwError(genericError));
      component.getMbDetails();
    });
  });
  it('should  getSpecialty', () => {
    component.getSpecialty();
    expect(component.specialityList).not.toEqual(null);
  });
});
