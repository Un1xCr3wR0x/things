/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BlockPeriod } from '../models';
import { VacationPeriod } from '../models';
import { TeamManagementService } from './team-management.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService, ApplicationTypeToken, RouterData, RouterDataToken } from '@gosi-ui/core';
import { AlertServiceStub } from 'testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeamManagementService', () => {
  let service: TeamManagementService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        TeamManagementService,
        { provide: AlertService, useClass: AlertServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ]
    });
    service = TestBed.inject(TeamManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('setVacationPeriods', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const vacationPeriodStub: VacationPeriod = {
        endDate: new Date(),
        startDate: new Date(),
        reason: 'Reason',
        userId: '101'
      };
      service.setVacationPeriods(vacationPeriodStub).subscribe(res => {
        expect(res).not.toEqual(null);
      });
      const req = httpTestingController.expectOne('/api/v1/vacation');
      expect(req.request.method).toEqual('POST');
      req.flush('');
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const vacationPeriodStub: VacationPeriod = {
        endDate: new Date(),
        startDate: new Date(),
        reason: 'Reason',
        userId: '101'
      };
      const vacationUrl = `/api/v1/vacation`;
      const errMsg = 'expect 404 error';
      service.setVacationPeriods(vacationPeriodStub).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(vacationUrl);
      expect(req.request.method).toBe('POST');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });

  describe('deleteVacationPeriods', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const blockPeriodStub: BlockPeriod = {
        userId: '101',
        employeeVacationId: 101,
        endDate: new Date(),
        startDate: new Date(),
        reason: 'Reason',
        status: 100,
        channel: 'tamam'
      };
      service.deleteVacationPeriods(blockPeriodStub).subscribe(res => {
        expect(res).not.toEqual(null);
      });
      const req = httpTestingController.expectOne(`/api/v1/vacation?vacationPeriodId=101&userId=101`);
      expect(req.request.method).toEqual('DELETE');
      req.flush('');
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const blockPeriodStub: BlockPeriod = {
        userId: '101',
        employeeVacationId: 101,
        endDate: new Date(),
        startDate: new Date(),
        reason: 'Reason',
        status: 100,
        channel: 'tamam'
      };
      const vacationUrl = `/api/v1/vacation?vacationPeriodId=${blockPeriodStub.employeeVacationId}&userId=${blockPeriodStub.userId}`;
      const errMsg = 'expect 404 error';
      service.deleteVacationPeriods(blockPeriodStub).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(vacationUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });

  describe('getMyTeamMembers', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      service.getMyTeamMembers().subscribe(res => {
        expect(res).toEqual(null);
      });
      const req = httpTestingController.expectOne('/api/v1/team-task/team');
      expect(req.request.method).toEqual('GET');
      req.flush(null);
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const teamUrl = `/api/v1/team-task/team`;
      const errMsg = 'expect 404 error';
      service.getMyTeamMembers().subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(teamUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('update vacation periods', () => {
    it('should update vacation periods', () => {
      const vacationPeriodId = 10000602;
      const vacationObject: VacationPeriod = {
        endDate: new Date(),
        startDate: new Date(),
        reason: 'Reason',
        userId: '101'
      };
      const httpTestingController = TestBed.inject(HttpTestingController);
      const vacationUrl = `/api/v1/vacation?vacationPeriodId=${vacationPeriodId}`;
      service.updateVacationPeriods(vacationObject, vacationPeriodId).subscribe();
      const req = httpTestingController.expectOne(vacationUrl);
      expect(req.request.method).toBe('PUT');
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const vacationPeriodId = 10000602;
      const vacationObject: VacationPeriod = {
        endDate: new Date(),
        startDate: new Date(),
        reason: 'Reason',
        userId: '101'
      };
      const vacationUrl = `/api/v1/vacation?vacationPeriodId=${vacationPeriodId}`;
      const errMsg = 'expect 404 error';
      service.updateVacationPeriods(vacationObject, vacationPeriodId).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(vacationUrl);
      expect(req.request.method).toBe('PUT');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('get vacation periods', () => {
    it('should get vacation periods', () => {
      const userId = '10000602';
      const httpTestingController = TestBed.inject(HttpTestingController);
      const vacationUrl = `/api/v1/vacation?userId=${userId}&isActiveVacation=false`;
      service.getVacationPeriods(userId).subscribe();
      const req = httpTestingController.expectOne(vacationUrl);
      expect(req.request.method).toBe('GET');
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const userId = '10000602';
      const vacationUrl = `/api/v1/vacation?userId=${userId}&isActiveVacation=false`;
      const errMsg = 'expect 404 error';
      service.getVacationPeriods(userId).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(vacationUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('reassign the transaction', () => {
    it('should reassign the transaction', () => {
      const taskid = 'addfy1234556787898090gfgh';
      const taskAssignee = 'csa';
      const workflowUser = 'admin';
      const type = 'complaint';
      const httpTestingController = TestBed.inject(HttpTestingController);
      const claimTaskUrl = `/api/process-manager/v1/taskservice/reassigntasks`;
      const comments = 'Comments';
      service.reassignTask(taskid, workflowUser, taskAssignee, type, comments).subscribe();
      const req = httpTestingController.expectOne(claimTaskUrl);
      expect(req.request.method).toBe('POST');
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const taskid = 'addfy1234556787898090gfgh';
      const taskAssignee = 'csa';
      const workflowUser = 'admin';
      const type = 'complaint';
      const claimTaskUrl = `/api/process-manager/v1/taskservice/reassigntasks`;
      const errMsg = 'expect 404 error';
      const comments = 'comments';
      service.reassignTask(taskid, workflowUser, taskAssignee, type, comments).subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(claimTaskUrl);
      expect(req.request.method).toBe('POST');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('get active reportees', () => {
    it('should get active reportees', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const reporteeUrl = `/api/v1/user/reportee`;
      service.getActiveReportees().subscribe();
      const req = httpTestingController.expectOne(reporteeUrl);
      expect(req.request.method).toBe('GET');
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const reporteeUrl = `/api/v1/user/reportee`;
      const errMsg = 'expect 404 error';
      service.getActiveReportees().subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(reporteeUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
  describe('get active leave counts', () => {
    it('should get active leave counts', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const countUrl = `/api/v1/user/reportee/summary`;
      service.getActiveAndLeaveCount().subscribe();
      const req = httpTestingController.expectOne(countUrl);
      expect(req.request.method).toBe('GET');
      httpTestingController.verify();
    });
    it('should throw error', () => {
      const countUrl = `/api/v1/user/reportee/summary`;
      const errMsg = 'expect 404 error';
      service.getActiveAndLeaveCount().subscribe(
        () => fail('404 error'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      );
      const req = httpMock.expectOne(countUrl);
      expect(req.request.method).toBe('GET');
      req.flush(errMsg, { status: 404, statusText: 'not found' });
    });
  });
});
