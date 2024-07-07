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
  RouterData,
  RouterDataToken,
  bindToObject,
  ApplicationTypeEnum,
  LanguageToken
} from '@gosi-ui/core';
import { TranslateModule } from '@ngx-translate/core';
import { throwError, BehaviorSubject } from 'rxjs';
import {
  AlertServiceStub,
  DocumentServiceStub,
  genericErrorOh,
  contributorsTestData,
  OhMockService,
  InjuryMockService,
  ComplicationMockService,
  ModalServiceStub,
  complicationDetailsTestData,
  initializeTheViewGDS,
  routerDataInjury,
  routerDataComplication,
  routerDataCloseInjury,
  routerDataCloseComplication,
  routerDataRejectInjury,
  routerDataRejectComplication,
  routerDataNull,
  routerDataDeadBodyrepartriation,
  routerDatatotalrepartriation,
  routerDataAddAllowance,
  routerDataReopnComplication,
  routerDataReopnInjury,
  routerDataModifyComplication,
  routerDataModifyInjury
} from 'testing';
import { ComplicationService, InjuryService, OhService } from '../../shared/services';
import { ViewComplicationScComponent } from './view-complication-sc.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InjuryStatus } from '../../shared/enums';
import { Complication } from '../../shared';

describe('ViewComplicationScComponent', () => {
  let component: ViewComplicationScComponent;
  let fixture: ComponentFixture<ViewComplicationScComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        RouterTestingModule,
        FormsModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
      declarations: [ViewComplicationScComponent],
      providers: [
        { provide: OhService, useClass: OhMockService },
        { provide: InjuryService, useClass: InjuryMockService },
        { provide: ComplicationService, useClass: ComplicationMockService },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: LanguageToken, useValue: new BehaviorSubject<string>('en') },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: RouterDataToken, useValue: new RouterData() },
        { provide: BsModalService, useClass: ModalServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewComplicationScComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewComplicationScComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(' ngOnInit', () => {
    it('should  ngOnInit', () => {
      component.socialInsuranceNo = contributorsTestData.socialInsuranceNo;
      component.ngOnInit();
      expect(component.registrationNo).not.toBe(null);
    });
  });
  describe(' getComplication', () => {
    it('should  getComplication', () => {
      component.getComplication();
      expect(component.getComplication).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataInjury), true);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataInjury), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataComplication), true);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataCloseInjury), true);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataCloseComplication), true);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataRejectInjury), true);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataRejectInjury), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataRejectComplication), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataNull), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataModifyInjury), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataModifyComplication), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataReopnInjury), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataReopnComplication), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataAddAllowance), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDatatotalrepartriation), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getWorkFlowType', () => {
    it('should  getWorkFlowType', () => {
      component.getWorkFlowType(bindToObject(new RouterData(), routerDataDeadBodyrepartriation), false);
      expect(component.workflowRequest).not.toBe(null);
    });
  });
  describe('getModifiedComplicationDetails', () => {
    it('should  getModifiedComplicationDetails', () => {
      component.getModifiedComplicationDetails();
      expect(component.modifiedcomplicationDetails).not.toBe(null);
    });
  });
  describe('getModifiedInjuryDetails', () => {
    it('should  getModifiedInjuryDetails', () => {
      component.getModifiedInjuryDetails();
      expect(component.modifiedInjuryDetails).not.toBe(null);
    });
  });
  describe('rejectComplication', () => {
    it('should  rejectComplication', () => {
      component['complication'] = bindToObject(new Complication(), complicationDetailsTestData.complicationDetailsDto);
      component['complication'].hasPendingChangeRequest = true;
      component['complication'].status.english = InjuryStatus.CURED_WITHOUT_DISABILITY;
      component.rejectComplication();
      expect(component.infoMessage).not.toBe(null);
    });
  });
  describe(' rejectComplication', () => {
    it('should  rejectComplication', () => {
      spyOn(component.router, 'navigate');
      component['complication'] = bindToObject(new Complication(), complicationDetailsTestData.complicationDetailsDto);
      component['complication'].hasPendingChangeRequest = false;
      component['complication'].status.english = InjuryStatus.CURED_WITHOUT_DISABILITY;
      component.rejectComplication();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' modifyComplicationTransaction', () => {
    it('should  modifyComplicationTransaction', () => {
      spyOn(component.router, 'navigate');
      component['complication'] = bindToObject(new Complication(), complicationDetailsTestData.complicationDetailsDto);
      component['complication'].hasPendingChangeRequest = false;
      component['complication'].hasRejectionInprogress = false;
      component['complication'].status.english = InjuryStatus.CURED_WITHOUT_DISABILITY;
      component.modifyComplicationTransaction();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' modifyComplicationTransaction', () => {
    it('should  modifyComplicationTransaction', () => {
      component['complication'] = bindToObject(new Complication(), complicationDetailsTestData.complicationDetailsDto);
      component['complication'].hasPendingChangeRequest = true;
      component['complication'].hasRejectionInprogress = false;
      component['complication'].status.english = InjuryStatus.APPROVED;
      component.modifyComplicationTransaction();
      expect(component.infoMessage).not.toBe(null);
    });
  });
  describe(' reopenComplicationTransaction', () => {
    it('should  reopenComplicationTransaction', () => {
      component['complication'] = bindToObject(new Complication(), complicationDetailsTestData.complicationDetailsDto);
      component['complication'].hasRejectionInprogress = true;
      component.reopenComplicationTransaction();
      expect(component.infoMessage).not.toBe(null);
    });
  });
  describe(' reopenComplicationTransaction', () => {
    it('should  reopenComplicationTransaction', () => {
      spyOn(component.router, 'navigate');
      component['complication'] = bindToObject(new Complication(), complicationDetailsTestData.complicationDetailsDto);
      component['complication'].hasRejectionInprogress = false;
      component['complication'].reopenAllowedIndicator = false;
      component.appToken == ApplicationTypeEnum.PUBLIC;
      component['complication'].status.english = InjuryStatus.REJECTED;
      component.reopenComplicationTransaction();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('getComplication', () => {
    it('getComplication should throw error', () => {
      spyOn(component.complicationService, 'getComplication').and.returnValue(throwError(genericErrorOh));
      spyOn(component, 'showError').and.callThrough();
      component.getComplication();
      expect(component.showError).toHaveBeenCalled();
    });
  });
});
