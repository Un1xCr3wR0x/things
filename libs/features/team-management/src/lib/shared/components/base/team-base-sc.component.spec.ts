/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamBaseScComponent } from './team-base-sc.component';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ApplicationTypeToken,
  bindToObject,
  RouterData,
  RouterDataToken,
  WorkflowService,
  EnvironmentToken,
  AuthTokenService
} from '@gosi-ui/core';
import { of } from 'rxjs';
import { BlockPeriod, TeamRequest } from '../../models';
import { BlockPeriodData, TeamManagementData, AuthTokenServiceStub, reporteeObject } from 'testing';
import { RouterTestingModule } from '@angular/router/testing';
@Component({
  selector: 'team-base-derived'
})
export class DerivedTeamBaseScComponent extends TeamBaseScComponent {}

describe('TeamBaseScComponent', () => {
  let component: DerivedTeamBaseScComponent;
  let fixture: ComponentFixture<DerivedTeamBaseScComponent>;

  beforeEach(async () => {
    const workflowServiceStub = () => ({
      getTransactionCount: (bpmrequest, userid) => ({ subscribe: f => f({}) }),
      getReporteeStatus: userid => ({ subscribe: f => f({}) })
    });
    await TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [DerivedTeamBaseScComponent],
      providers: [
        HttpClientModule,
        {
          provide: AuthTokenService,
          useClass: AuthTokenServiceStub
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: WorkflowService, useFactory: workflowServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DerivedTeamBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('set response', () => {
    it('Should getset the response', () => {
      const isCountOnly = false;
      const reporteeItem = reporteeObject;
      spyOn(component.workflowService, 'getTransactionCount').and.returnValue(
        of(bindToObject(new TeamRequest(), TeamManagementData))
      );
      component.setResponse(reporteeItem, isCountOnly);
      expect(reporteeItem.pendingTransaction).not.toEqual(null);
    });
    it('Should getset the response', () => {
      const isCountOnly = false;
      const reporteeItem = reporteeObject;
      const response = [
        {
          channel: 'tamam',
          userId: 'e0026212',
          startDate: null,
          endDate: null,
          reason: 'reason',
          status: '3',
          employeeVacationId: '1234e'
        }
      ];
      spyOn(component.tmService, 'getVacationPeriods').and.returnValue(of([bindToObject(new BlockPeriod(), response)]));
      component.setResponse(reporteeItem, isCountOnly);

      expect(reporteeItem.status).not.toEqual(null);
      expect(reporteeItem.statusLabel).not.toEqual(null);
      expect(reporteeItem).not.toEqual(null);
      expect(response[0].channel).toEqual('tamam');
    });
    it('Should getset the response', () => {
      const isCountOnly = false;
      const reporteeItem = reporteeObject;
      const response = [];
      spyOn(component.tmService, 'getVacationPeriods').and.returnValue(of([bindToObject(new BlockPeriod(), response)]));
      component.setResponse(reporteeItem, isCountOnly);

      expect(reporteeItem.status).not.toEqual(null);
      expect(reporteeItem.statusLabel).not.toEqual(null);
      expect(reporteeItem).not.toEqual(null);
      expect(response.length).toEqual(0);
    });
    it('Should getset the response', () => {
      const isCountOnly = false;
      const reporteeItem = reporteeObject;
      component.tmService.myTeamInitialListOfReportees = TeamManagementData;
      component.setResponse(reporteeItem, isCountOnly);
      expect(reporteeItem.pendingTransaction).not.toEqual(null);
      expect(reporteeItem.status).not.toEqual(null);
      expect(component.tmService.myTeamInitialListOfReportees?.response).not.toEqual(null);
      expect(component.tmService.myTeamInitialListOfReportees).not.toEqual(null);
    });
  });
});
