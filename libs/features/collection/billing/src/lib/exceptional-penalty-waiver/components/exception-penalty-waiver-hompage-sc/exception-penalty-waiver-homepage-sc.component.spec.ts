/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AlertServiceStub,
  DocumentServiceStub,
  LookupServiceStub,
  DetailedBillServiceStub,
  PenalityWavierServiceStub,
  BillDashboardServiceStub,
  genericError
} from 'testing';
import { BehaviorSubject, throwError } from 'rxjs';
import {
  AlertService,
  LanguageToken,
  ApplicationTypeToken,
  DocumentService,
  LookupService,
  RouterDataToken,
  RouterData
} from '@gosi-ui/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ExceptionalPenaltyWaiverHomepageScComponent } from './exception-penalty-waiver-homepage-sc.component';
import { DetailedBillService } from '../../../shared/services/detailed-bill.service';
import { PenalityWavierService } from '../../../shared/services/penality-wavier.service';
import { BillDashboardService } from '../../../shared/services/bill-dashboard.service';
import { BillingConstants } from '../../../shared/constants/billing-constants';
import { EntityTypeEnum } from '../../../shared/enums/entity-type';
import { ComponentHostDirective } from '@gosi-ui/foundation-theme';
import { FormBuilder } from '@angular/forms';
import { EntityTypeVicDcComponent } from '../entity-type-vic-dc/entity-type-vic-dc.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { EntityTypeEstablishmentDcComponent } from '../entity-type-establishment-dc/entity-type-establishment-dc.component';
import { EntityTypeAllEntityDcComponent } from '../entity-type-all-entity-dc/entity-type-all-entity-dc.component';

describe('ExceptionalPenaltyWaiverHomepageScComponent', () => {
  let component: ExceptionalPenaltyWaiverHomepageScComponent;
  let fixture: ComponentFixture<ExceptionalPenaltyWaiverHomepageScComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule],
      declarations: [
        EntityTypeVicDcComponent,
        ExceptionalPenaltyWaiverHomepageScComponent,
        ComponentHostDirective,
        EntityTypeEstablishmentDcComponent,
        EntityTypeAllEntityDcComponent
      ],
      providers: [
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: LookupService, useClass: LookupServiceStub },
        {
          provide: DetailedBillService,
          useClass: DetailedBillServiceStub
        },
        { provide: PenalityWavierService, useClass: PenalityWavierServiceStub },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: BillDashboardService,
          useClass: BillDashboardServiceStub
        },
        FormBuilder,
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [EntityTypeVicDcComponent, EntityTypeEstablishmentDcComponent, EntityTypeAllEntityDcComponent]
      }
    });
    TestBed.compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionalPenaltyWaiverHomepageScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('test suite for exeptional penality waiver home screen 1', () => {
    it('should get registration number details', () => {
      let res = {
        searchOption: 'registration',
        regNo: 200085744
      };
      spyOn(component.router, 'navigate');
      spyOn(component.detailedBillService, 'getBillingHeader').and.callThrough();
      component.onVerify(res);
      expect(component.detailedBillService.getBillingHeader).toHaveBeenCalledWith(res.regNo, true);
    });
  });
  describe('test suite for exeptional penality waiver home screen 1', () => {
    it('should get registration number details error', () => {
      let res = {
        searchOption: 'registration',
        regNo: 200085744
      };
      spyOn(component.alertService, 'showError');
      spyOn(component.detailedBillService, 'getBillingHeader').and.returnValue(throwError(genericError));
      component.onVerify(res);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('onVerify', () => {
    it('should get SIN number details', () => {
      let res = {
        searchOption: 'SIN',
        sinNo: 210274677
      };
      spyOn(component.router, 'navigate').and.callThrough();
      spyOn(component.penalityWavierService, 'getVicWavierPenalityDetails').and.callThrough();
      component.onVerify(res);
      // expect(component.router.navigate).toHaveBeenCalledWith([
      //   [BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC],
      //   Object({ queryParams: Object({ sin: res?.sinNo, searchOption: 'SIN' }) })
      // ])
      // expect(component.penalityWavierService.getVicWavierPenalityDetails).toHaveBeenCalledWith([res.sinNo, 'SPECIAL'],'');
    });
  });
  describe('onVerify', () => {
    xit('should get SIN number details error', () => {
      let res = {
        searchOption: 'SIN',
        sinNo: 210274677
      };
      spyOn(component.alertService, 'showError');
      spyOn(component.penalityWavierService, 'getVicWavierPenalityDetails').and.returnValue(
        throwError({
          error: {
            code: 'EST-12-1001',
            message: {
              english: 'No records',
              arabic: 'No records'
            },
            details: [{ message: null }]
          }
        })
      );
      component.onVerify(res);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  xdescribe('onVerify', () => {
    it('should get SIN number details return message', () => {
      let res = {
        searchOption: 'SIN',
        sinNo: 210274677
      };
      spyOn(component.alertService, 'showError');
      spyOn(component.creditManagementService, 'getContirbutorDetails').and.callThrough();
      spyOn(component.penalityWavierService, 'getVicWavierPenalityDetails').and.returnValue(
        throwError({
          error: {
            code: 'EST-12-1001',
            message: {
              english: 'No records',
              arabic: 'No records'
            },
            details: [
              {
                message: {
                  english: 'No records',
                  arabic: 'No records'
                }
              }
            ]
          }
        })
      );
      component.onVerify(res);
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('onVerify', () => {
    it('should get segmentation details', () => {
      let res = {
        searchOption: 'segmentation',
        regNo: 210274677
      };
      spyOn(component.router, 'navigate');
      component.onVerify(res);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ESTABLISHMENT],
        Object({ queryParams: Object({ regNo: 210274677, searchOption: 'segmentation' }) })
      );
    });
  });
  describe('test suite for exeptional penality waiver home screen 2', () => {
    it('should get vicSegmentation', () => {
      let res = {
        searchOption: 'vicSegmentation',
        sinNo: 210274677
      };
      spyOn(component.router, 'navigate');
      component.onVerify(res);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_VIC],
        Object({ queryParams: Object({ sin: 210274677, searchOption: 'vicSegmentation' }) })
      );
    });
  });
  describe('onVerify', () => {
    it('should get entityType details', () => {
      let res = {
        searchOption: 'entityType'
      };
      spyOn(component.router, 'navigate');
      component.onVerify(res);
      expect(component.router.navigate).toHaveBeenCalledWith(
        [BillingConstants.ROUTE_EXCEPTIONAL_PENALITY_WAIVER_ENTITY_TYPE],
        Object({ queryParams: Object({ searchOption: 'entityType' }) })
      );
    });
  });
  xdescribe('test suite for exeptional penality ', () => {
    it('should load person components 1', () => {
      spyOn(component.router, 'navigate');
      component.loadEntityTypeComponent(EntityTypeEnum.Establishment);
      expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
    });
  });

  xdescribe('test suite for exeptional penality ', () => {
    it('should load person components 2', () => {
      spyOn(component.router, 'navigate');
      component.loadEntityTypeComponent(EntityTypeEnum.VIC);
      expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
    });
  });

  xdescribe('test suite for exeptional penality ', () => {
    it('should load person components 3', () => {
      spyOn(component.router, 'navigate');
      component.loadEntityTypeComponent(EntityTypeEnum.AllEntities);
      expect(component.gosiComponentHost.viewContainerRef.length).toBe(1);
    });
  });

  describe('showMandatoryErrorMessage', () => {
    it('Should call showMandatoryErrorMessage', () => {
      spyOn(component.alertService, 'showMandatoryErrorMessage');
      component.showMandatoryFieldsError();
      expect(component.alertService.showMandatoryErrorMessage).toHaveBeenCalled();
    });
  });
  describe('onEntityTypeSelect', () => {
    it('should onEntityTypeSelect', () => {
      component.onEntityTypeSelect((component.entityType = EntityTypeEnum.VIC));
      expect(component.entityType).toEqual((component.entityType = EntityTypeEnum.VIC));
    });
  });
  describe('onEntityTypeSelect', () => {
    it('should onEntityTypeSelect', () => {
      component.onEntityTypeSelect((component.entityType = EntityTypeEnum.Establishment));
      expect(component.entityType).toEqual((component.entityType = EntityTypeEnum.Establishment));
    });
  });
  describe('reset', () => {
    it('Should reset entity type', () => {
      component.entityType = EntityTypeEnum.VIC;
      component.reset();
      expect(component.entityType).toBeNull();
    });
  });
});
