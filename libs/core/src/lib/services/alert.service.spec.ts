import { TestBed } from '@angular/core/testing';
import { AlertService } from './alert.service';
import { ApplicationTypeToken } from '../tokens';
import { ApplicationTypeEnum, AlertTypeEnum, AlertIconEnum } from '../enums';
import { BilingualText, Alert } from '../models';
import { alertDanger, alertInfo, alertSuccess, alertWarning, message, details } from './alert-test-data';

describe('AlertService', () => {
  let alertService: AlertService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApplicationTypeToken,
          useValue: ApplicationTypeEnum.PRIVATE
        }
      ]
    });
    alertService = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(alertService).toBeTruthy();
  });
  it('should set show warning key', () => {
    const messageKey = 'test';
    alertService.showWarningByKey(messageKey);
    expect(alertService.clearAlerts).toHaveBeenCalled;
  });
  it('should  show sucess message', () => {
    const messageKey = { english: 'test', arabic: 'test' };
    alertService.showSuccess(messageKey);
  });
  it('should  show warning message', () => {
    const messageKey = { english: 'test', arabic: 'test' };
    alertService.showWarning(messageKey);
  });
  it('should et show error message', () => {
    const messageKey = { english: 'test', arabic: 'test' };
    alertService.showError(messageKey);
  });
  it('should  show info message', () => {
    const messageKey = { english: 'test', arabic: 'test' };
    alertService.showInfo(messageKey);
  });
  it('should show mandatory error message', () => {
    alertService.showMandatoryErrorMessage();
  });
  it('should show success by key', () => {
    const messageKey = 'test';
    const messageParam = { id: '123' };
    alertService.showSuccessByKey(messageKey, messageParam);
  });
  it('should show error by key', () => {
    const messageKey = 'test';
    alertService.showSuccessByKey(messageKey, AlertTypeEnum.DANGER);
  });
  it('should show info by key', () => {
    const messageKey = 'test';
    alertService.showSuccessByKey(messageKey, AlertTypeEnum.INFO);
  });
  it('should show warning by key', () => {
    const messageKey = 'test';
    alertService.showSuccessByKey(messageKey, AlertTypeEnum.WARNING);
  });
  it('should get alert', () => {
    alertService.getAlerts().subscribe(data => {
      expect(data.length).toBeGreaterThanOrEqual(0);
    });
  });
  it('should clear alert', () => {
    alertService.clearAlerts();
    alertService.getAlerts().subscribe(data => {
      expect(data.length).toEqual(0);
    });
  });

  it('should clear warning alert', () => {
    alertService.clearAllWarningAlerts();
    let count = 0;
    alertService.getAlerts().subscribe(data => {
      data.forEach(function (object: Alert) {
        if (object.type === AlertTypeEnum.WARNING) count++;
      });
      expect(count).toEqual(0);
    });
  });

  it('should clear success alert', () => {
    alertService.clearAllSuccessAlerts();
    let count = 0;
    alertService.getAlerts().subscribe(data => {
      data.forEach(function (object: Alert) {
        if (object.type === AlertTypeEnum.SUCCESS) count++;
      });
      expect(count).toEqual(0);
    });
  });

  it('should clear error alert', () => {
    alertService.clearAllErrorAlerts();
    let count = 0;
    alertService.getAlerts().subscribe(data => {
      data.forEach(function (object: Alert) {
        if (object.type === AlertTypeEnum.DANGER) count++;
      });
      expect(count).toEqual(0);
    });
  });

  it('should show mandatory documents error', () => {
    alertService.showMandatoryDocumentsError();
    alertService.getAlerts().subscribe((data: Alert[]) => {
      expect(data[data.length - 1].type).toEqual(AlertTypeEnum.DANGER);
    });
  });

  it('should create new alert object with when timeout passed', () => {
    // @ts-ignore
    spyOn(alertService, 'getIcon').and.returnValue(AlertIconEnum.ERROR);
    // @ts-ignore
    spyOn(alertService, 'pushAlert').and.returnValue();
    // @ts-ignore
    alertService.setAlert(message, AlertTypeEnum.DANGER, details, 2);
    // @ts-ignore
    expect(alertService.pushAlert).toHaveBeenCalled();
  });

  it('should create new alert key object with when subMessageKeys and timeout passed', () => {
    // @ts-ignore
    spyOn(alertService, 'getIcon').and.returnValue(AlertIconEnum.ERROR);
    // @ts-ignore
    spyOn(alertService, 'pushAlert').and.returnValue();
    // @ts-ignore
    alertService.setAlertKey('Alert Message', AlertTypeEnum.DANGER, {}, 2, [{ key: 1, param: 'message' }]);
    // @ts-ignore
    expect(alertService.pushAlert).toHaveBeenCalled();
  });

  it('should push alert when type is same', () => {
    // @ts-ignore
    alertService.alerts.next([alertDanger, alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.pushAlert(alertDanger);
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo, alertDanger]);
  });

  it('should push alert when type is different', () => {
    // @ts-ignore
    alertService.alerts.next([alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.pushAlert(alertDanger);
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo, alertDanger]);
  });

  it('should set info message from key', () => {
    const messageKey = 'test';
    // @ts-ignore
    spyOn(alertService, 'setAlertKey').and.returnValue();
    alertService.setInfoByKey(messageKey);
    // @ts-ignore
    expect(alertService.setAlertKey).toHaveBeenCalledWith(messageKey, AlertTypeEnum.INFO, undefined);
  });

  it('should clear all error alerts when error alert present', () => {
    // @ts-ignore
    alertService.alerts.next([alertDanger, alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.clearAllErrorAlerts();
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo]);
  });

  it('should clear all error alerts when error alert NOT present', () => {
    // @ts-ignore
    alertService.alerts.next([alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.clearAllErrorAlerts();
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo]);
  });

  it('should clear all success alerts when success alert present', () => {
    // @ts-ignore
    alertService.alerts.next([alertSuccess, alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.clearAllSuccessAlerts();
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo]);
  });

  it('should clear all success alerts when success alert NOT present', () => {
    // @ts-ignore
    alertService.alerts.next([alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.clearAllSuccessAlerts();
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo]);
  });

  it('should clear all warning alerts when warning alert present', () => {
    // @ts-ignore
    alertService.alerts.next([alertWarning, alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.clearAllWarningAlerts();
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo]);
  });

  it('should clear all warning alerts when warning alert NOT present', () => {
    // @ts-ignore
    alertService.alerts.next([alertInfo]);
    // @ts-ignore
    spyOn(alertService.alerts, 'next').and.returnValue();
    // @ts-ignore
    alertService.clearAllWarningAlerts();
    // @ts-ignore
    expect(alertService.alerts.next).toHaveBeenCalledWith([alertInfo]);
  });

  it('should show document error message when public app', () => {
    // @ts-ignore
    alertService.appToken = ApplicationTypeEnum.PUBLIC;
    spyOn(alertService, 'showErrorByKey').and.returnValue();
    alertService.showMandatoryDocumentsError();
    expect(alertService.showErrorByKey).toHaveBeenCalledWith('CORE.ERROR.UPLOAD-MANDATORY-DOCUMENTS');
  });
});
