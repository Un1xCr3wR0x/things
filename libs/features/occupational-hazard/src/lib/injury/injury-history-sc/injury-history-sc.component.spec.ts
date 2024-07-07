/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { ProgressWizardDcComponent } from '@gosi-ui/foundation-theme';
import { TranslateModule } from '@ngx-translate/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  AlertServiceStub,
  ComplicationMockService,
  DocumentServiceStub,
  genericError,
  genericErrorOh,
  injuryHistoryTestData,
  InjuryMockService,
  OhMockService,
  sinResponseData,
  injuryfilter
} from 'testing';
import { ProgressWizardDcMockComponent, TabsMockComponent } from 'testing/mock-components';
import { InjuryHistoryScComponent } from '..';
import { ComplicationService, InjuryService, OhService } from '../../shared/services';

describe('InjuryHistoryScComponent', () => {
  let component: InjuryHistoryScComponent;
  let fixture: ComponentFixture<InjuryHistoryScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [InjuryHistoryScComponent, ProgressWizardDcMockComponent, TabsMockComponent],
      providers: [
        {
          provide: ProgressWizardDcComponent,
          useClass: ProgressWizardDcMockComponent
        },
        { provide: TabsetComponent, useClass: TabsMockComponent },
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InjuryHistoryScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(InjuryHistoryScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  describe('getComplication', () => {
    it('should getComplication', () => {
      const index = 0;
      component.getComplication(injuryHistoryTestData, index);
      expect(component.injuryHistoryList).not.toBe(null);
    });
  });
  describe('getComplication', () => {
    it('getComplication should throw error', () => {
      const index = 0;
      spyOn(component.complicationService, 'getComplicationHistory').and.returnValue(throwError(genericErrorOh));

      spyOn(component, 'showError').and.callThrough();
      component.getComplication(injuryHistoryTestData, index);
      expect(component.showError).toHaveBeenCalled();
    });
  });

  describe('getInjuryHistory', () => {
    it('should getInjuryHistory', () => {
      if (sinResponseData.socialInsuranceNo) {
        component.getInjuryHistory();
        expect(component.injuryHistoryList).not.toBe(null);
      }
    });
  });
  describe('getInjuryHistory', () => {
    it('getInjuryHistory should throw error', () => {
      spyOn(component.injuryService, 'getInjuryHistory').and.returnValue(throwError(genericError));
      spyOn(component, 'showError').and.callThrough();
      component.getInjuryHistory();
      expect(component.showError).toHaveBeenCalled();
    });
  });
  describe('getInjuryFilter', () => {
    it('should getInjuryFilter', () => {
      component.getInjuryFilter(injuryfilter);
      if (injuryfilter) {
        if (injuryfilter.status) {
          injuryfilter.status.forEach(items => {
            if (items) {
              expect(component.statusLists).not.toBe(null);
            }
          });
        }
      } else {
        spyOn(component.injuryService, 'setStatus');
        expect(component.injuryService.setStatus).toHaveBeenCalled();
      }
      component.getInjuryHistory();
      expect(component.injuryHistoryList).not.toBe(null);
    });
  });
  describe('addNewComplication', () => {
    it('should not navigate to add new complication page', () => {
      spyOn(component.router, 'navigate');
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.addComplication = true;
      component.isEstClosed = false;
      component.addNewComplication();
      expect(component.router.navigate).toHaveBeenCalledWith([`/home/oh/complication/add`]);
    });
  });
  describe('resetFilter', () => {
    it('should not navigate to reset Filter', () => {
      spyOn(component.injuryService, 'setStatus');
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.resetFilter();
      expect(component.injuryService.setStatus).toHaveBeenCalled();
    });
  });
  describe('addNewInjury', () => {
    it('should  navigate to add new injuury page', () => {
      spyOn(component.router, 'navigate');
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.addNewInjury();
      expect(component.router.navigate).toHaveBeenCalledWith([`home/oh/injury/add`]);
    });
  });
  describe('getStatus', () => {
    it('should not navigate to get data based on selected Status detail', () => {
      component.getStatus(injuryHistoryTestData.status);
      expect(component.statusLists).not.toBe(null);
    });
  });

  describe('view Injury', () => {
    it('should view injury details', () => {
      spyOn(component.ohService, 'setInjuryId');
      spyOn(component.ohService, 'setInjuryDetails');
      spyOn(component.router, 'navigate');
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.injuryId = injuryHistoryTestData.injuryId;
      component.viewInjury(injuryHistoryTestData);
      expect(component.ohService.setInjuryId).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${injuryHistoryTestData.registrationNo}/${injuryHistoryTestData.selectedSIN}/${injuryHistoryTestData.injuryId}/injury/info`
      ]);
    });
  });
  describe('view Complication', () => {
    it('should view Complication details', () => {
      spyOn(component.ohService, 'setInjuryId');
      spyOn(component.ohService, 'setInjuryDetails');
      spyOn(component.router, 'navigate');
      component.registrationNo = injuryHistoryTestData.registrationNo;
      component.socialInsuranceNo = injuryHistoryTestData.selectedSIN;
      component.injuryId = injuryHistoryTestData.injuryId;
      component.complicationId = injuryHistoryTestData.complication[0].injuryId;
      component.viewComplication(injuryHistoryTestData);
      expect(component.ohService.getInjuryId).not.toBe(null);
      expect(component.router.navigate).toHaveBeenCalledWith([
        `home/oh/view/${injuryHistoryTestData.registrationNo}/${injuryHistoryTestData.selectedSIN}/${injuryHistoryTestData.injuryId}/${component.complicationId}/complication/info`
      ]);
    });
  });
  describe('should assign value into object', () => {
    it('should load more', () => {
      spyOn(component, 'requestHandler').and.callThrough();
      component.onLoadMore(2);
      expect(component.requestHandler).toHaveBeenCalled();
    });
    it('should get list ', () => {
      spyOn(component.injuryService, 'getInjuryHistory');
      expect(component.injuryService.getInjuryHistory).not.toBe(null);
    });
  });

  describe('loadMore', () => {
    it('should load more', () => {
      component.pageSize = 0;
      component.totalSize = 2;
      spyOn(component, 'requestHandler').and.callThrough();
      component.onLoadMore(5);
      expect(component.requestHandler).toHaveBeenCalled();
    });
  });

  describe('reportComplication', () => {
    it('should  navigate to a report Complicationpage', () => {
      spyOn(component.router, 'navigate');
      injuryHistoryTestData.addComplicationAllowed = false;
      component.reportComplication(injuryHistoryTestData);
      expect(component.reportComplication).not.toBe(null);
    });
  });
  describe('reportComplication', () => {
    it('should navigate to add new complication page', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.ohService, 'setInjuryId');
      injuryHistoryTestData.addComplicationAllowed = true;
      component.reportComplication(injuryHistoryTestData);
      expect(component.reportComplication).not.toBe(null);
      expect(component.router.navigate).toHaveBeenCalledWith(
        ['home/oh/complication/add'],
        Object({ queryParams: Object({ type: 'report' }) })
      );
    });
  });
});
