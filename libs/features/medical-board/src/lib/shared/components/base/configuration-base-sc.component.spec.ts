import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ApplicationTypeEnum, ApplicationTypeToken, bindToObject } from '@gosi-ui/core';
import { of, throwError } from 'rxjs';
import { ActivatedRouteStub, configurationWrapperTest, genericError, individualSessionData } from 'testing';
import { ConfigurationWrapper, IndividualSessionDetails } from '../../models';
import { ConfigurationBaseScComponent } from './configuration-base-sc.component';
@Component({
  selector: 'configuration-base-derived'
})
export class DerivedConfigurationBaseScComponent extends ConfigurationBaseScComponent {}
describe('ConfigurationBaseScComponent', () => {
  let component: DerivedConfigurationBaseScComponent;
  let fixture: ComponentFixture<ConfigurationBaseScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [DerivedConfigurationBaseScComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        DatePipe
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DerivedConfigurationBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedConfigurationBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });;

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should getIndividualSessionDetails', () => {
    const templateId = 45;
    spyOn(component.configurationService, 'getIndividualSessionDetails').and.returnValue(
      of(bindToObject(new IndividualSessionDetails(), individualSessionData))
    );
    component.getIndividualSessionDetails(templateId);
    expect(component.configurationService.getIndividualSessionDetails).toHaveBeenCalled();
  });
  it('should throw error for getIndividualSessionDetails', () => {
    const templateId = 45;
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.configurationService, 'getIndividualSessionDetails').and.returnValue(throwError(genericError));
    component.getIndividualSessionDetails(templateId);
    expect(component.alertService.showError).toHaveBeenCalled();
  });
  it('should get field office', () => {
    spyOn(component.lookupService, 'getFieldOfficeList').and.callThrough();
    component.getOfficeList();
    expect(component.fieldOfficeLists$).not.toEqual(null);
  });
  it('should get getSessionType', () => {
    spyOn(component.lookupService, 'getMedicalBoardTypeList').and.callThrough();
    component.getSessionType();
    expect(component.medicalBoardTypeLists$).not.toEqual(null);
  });
  it('should get getStopReasonList', () => {
    spyOn(component.lookupService, 'getStopReasonsList').and.callThrough();
    component.getStopReasonList();
    expect(component.stopReasonList$).not.toEqual(null);
  });
  it('should get getHoldReasonList', () => {
    spyOn(component.lookupService, 'getHoldReasonsList').and.callThrough();
    component.getHoldReasonList();
    expect(component.holdReasonList$).not.toEqual(null);
  });
  it('should getSessionRecords', () => {
    spyOn(component.configurationService, 'getConfigurationList').and.returnValue(
      of(bindToObject(new ConfigurationWrapper(), configurationWrapperTest))
    );
    component.getSessionRecords({});
    expect(component.configurationService.getConfigurationList).toHaveBeenCalled();
  });
  it('should throw error for getIndividualSessionDetails', () => {
    spyOn(component.alertService, 'showError').and.callThrough();
    spyOn(component.configurationService, 'getConfigurationList').and.returnValue(throwError(genericError));
    component.getSessionRecords({});
    expect(component.alertService.showError).toHaveBeenCalled();
  });
  it('should handle errors', () => {
    const errors = {
      error: {
        message: { englis: 'error occurred', arabic: 'error occured' }
      }
    };
    component.handleErrors(errors);
    expect(component).toBeTruthy();
  });
});
