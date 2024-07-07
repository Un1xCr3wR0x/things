import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Directive } from '@angular/core';
import { ScheduledSessionsBaseScComponent } from './scheduled-sessions-base-sc.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, bindToObject } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import { IndividualSessionEvents, MBConstants, SessionCalendar } from '../..';
import { genericError, ModalServiceStub, sessionCalendarMock, SessionDataMock } from 'testing';
import { BsModalService } from 'ngx-bootstrap/modal';
const routerSpy = { navigate: jasmine.createSpy('navigate') };

@Component({
  selector: 'mb-scheduled-sessions-base-derived'
})
export class DerivedScheduledSessionsBaseScComponent extends ScheduledSessionsBaseScComponent {}
describe('ScheduledSessionsBaseScComponent', () => {
  let component: DerivedScheduledSessionsBaseScComponent;
  let fixture: ComponentFixture<ScheduledSessionsBaseScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DerivedScheduledSessionsBaseScComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: Router, useValue: routerSpy },
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DerivedScheduledSessionsBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('getCurrentMonthDetails', () => {
    it('should getCurrentMonthDetails', () => {
      const currentMonth = 11;
      const currentyear = 2021;
      spyOn(component.sessionCalendarService, 'getSessionDetails').and.returnValue(
        of(bindToObject(new SessionCalendar(), sessionCalendarMock))
      );
      component.getCurrentMonthDetails(currentMonth, currentyear);
      expect(component.sessionCalendarService.getSessionDetails).toHaveBeenCalled();
    });
    it('should throw error for getCurrentMonthDetails', () => {
      const currentMonth = 11;
      const currentyear = 2021;
      spyOn(component.alertService, 'showError').and.callThrough();
      spyOn(component.sessionCalendarService, 'getSessionDetails').and.returnValue(throwError(genericError));
      component.getCurrentMonthDetails(currentMonth, currentyear);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  it('should getIndividualSessionDetails', () => {
    const selectedDate = "'2016-08-13T00:00:00.000Z'";
    spyOn(component.sessionCalendarService, 'getDateSessionDetails').and.returnValue(
      of(bindToObject(new IndividualSessionEvents(), SessionDataMock))
    );
    component.getIndividualSessionDetails(selectedDate);
    expect(component.sessionCalendarService.getDateSessionDetails).toHaveBeenCalled();
  });
  it('should throw error for getIndividualSessionDetails', () => {
    const selectedDate = "'2016-08-13T00:00:00.000Z'";
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.sessionCalendarService, 'getDateSessionDetails').and.returnValue(throwError(genericError));
    component.getIndividualSessionDetails(selectedDate);
    expect(component.alertService.showError).toHaveBeenCalled();
  });
  it('should navigateToParticipant', () => {
    component.navigateToParticipant();
    expect(component.router.navigate).toHaveBeenCalledWith([MBConstants.ROUTE_PARTICIPANTS_QUEUE]);
  });
  it('should getOfficeLists', () => {
    spyOn(component.lookupService, 'getMbLocations').and.callThrough();
    component.getOfficeLists();
    expect(component.fieldOfficeList$).not.toEqual(null);
  });
});
