import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ValidateMiscellaneousAdjustmentScComponent } from './validate-miscellaneous-adjustment-sc.component';

import { FormBuilder } from '@angular/forms';
import {
  AlertService,
  DocumentService,
  ExchangeRateService,
  GosiHttpInterceptor,
  LookupService,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { AlertServiceStub, DocumentServiceStub, genericError, LookupServiceStub, ModalServiceStub } from 'testing';
import { BillEstablishmentServiceStub, BillingRoutingServiceStub } from 'testing/mock-services';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BillingRoutingService } from '../../../../shared/services';
import { EstablishmentService } from '@gosi-ui/features/occupational-hazard/lib/shared/services/establishment.service';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ValidatorRoles } from '../../../../shared/enums';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
describe('ValidateMiscellaneousAdjustmentScComponent', () => {
  let component: ValidateMiscellaneousAdjustmentScComponent;
  let fixture: ComponentFixture<ValidateMiscellaneousAdjustmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidateMiscellaneousAdjustmentScComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        {
          provide: DocumentService,
          useClass: DocumentServiceStub
        },
        { provide: BillingRoutingService, useClass: BillingRoutingServiceStub },
        { provide: EstablishmentService, useClass: BillEstablishmentServiceStub },
        {
          provide: AlertService,
          useClass: AlertServiceStub
        },
        {
          provide: LookupService,
          useClass: LookupServiceStub
        },
        { provide: BsModalService, useClass: ModalServiceStub },

        {
          provide: RouterDataToken,
          useValue: new RouterData()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateMiscellaneousAdjustmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('intialise the view', () => {
    it('should intialise the view for validator', () => {
      component.referenceNumber = 201;
      component.registrationNumber = 200085744;
      spyOn(component, 'getKeysFromTokens');
      spyOn(component, 'getDataForViews');
      component.ngOnInit();
      expect(component.getDataForViews).toHaveBeenCalled();
      expect(component.getKeysFromTokens).toHaveBeenCalled();
    });
    it('should intialise the view for validator', inject([RouterDataToken], (token: RouterData) => {
      token.transactionId = 423651;
      token.payload = '{"registrationNo": 200085744, "waiverId": 532231}';
      component.getKeysFromTokens();
      expect(component.registrationNumber).toBeDefined();
      expect(component.referenceNumber).toBeDefined();
      expect(component.transactionNumber).toBeDefined();
    }));
    it('should get data for view for establishment', () => {
      component.registrationNumber = 200085744;
      component.referenceNumber = 201;
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      component.getDataForViews();
      spyOn(component.alertService, 'showError');
    });
    it('should set flags for validator 1', () => {
      component.identifyValidatorActionDetails(ValidatorRoles.VALIDATOR_ONE);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeFalsy();
    });
    // it('should set flags for validator 1s', () => {
    //   component.identifyValidatorActions(ValidatorRoles.VALIDATOR_ONE);
    //   component.isGOL=true;
    //   expect(component.canReturn).toBeFalsy();
    //   expect(component.editFlag).toBeTruthy();
    // });
    it('should set flags for validator 2', () => {
      component.identifyValidatorActionDetails(ValidatorRoles.VALIDATOR_TWO);
      expect(component.canReturn).toBeTruthy();
      expect(component.canReturn).toBeTruthy();
    });
    it('should flags  to the user role FC Validator', () => {
      component.identifyValidatorActionDetails(ValidatorRoles.FC_VALIDATOR);
      expect(component.canReject).toBeFalsy();
      expect(component.canReturn).toBeTruthy();
      expect(component.editFlag).toBeFalsy();
    });
  });
});
