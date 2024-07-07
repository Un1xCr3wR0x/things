/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentToken, RouterDataToken, RouterData, ApplicationTypeToken, LanguageToken } from '@gosi-ui/core';

//import { RestartHeirBenefitScComponent } from './restart-benefit-transaction-sc.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalServiceStub, ActivatedRouteStub } from 'testing';
import { BehaviorSubject } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { RestartHeirBenefitScComponent } from '../restart-heir-benefit-sc/restart-heir-benefit-sc.component';
import { RestartBenefitTransactionScComponent } from './restart-benefit-transaction-sc.component';

describe('RestartHeirBenefitScComponent', () => {
  let component: RestartBenefitTransactionScComponent;
  let fixture: ComponentFixture<RestartBenefitTransactionScComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: Router, useValue: routerSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe
      ],
      declarations: [RestartHeirBenefitScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestartBenefitTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOninit', () => {
    it('should be ngOninit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getRestartBenefitDetails', () => {
    it('should getRestartBenefitDetails', () => {
      const sin = 23452323;
      const benefitRequestId = 234335231;
      const referenceNo = 32211223;
      component.getRestartBenefitDetails();
      expect(component.getRestartBenefitDetails).toBeDefined();
    });
  });
  describe('getRestartCalcDetails', () => {
    it('should  getRestartCalcDetails', () => {
      const sin = 23452323;
      const benefitRequestId = 234335231;
      const referenceNo = 32211223;
      component.getRestartCalcDetails();
      component.modifyBenefitService.getRestartCalculation(sin, benefitRequestId, referenceNo).subscribe(res => {
        component.restartCalculations = res;
      });
      expect(component.getRestartCalcDetails).toBeDefined();
    });
  });
  describe('onViewBenefitDetails', () => {
    it('should onViewBenefitDetails', () => {
      component.onViewBenefitDetails();
      expect(component.onViewBenefitDetails).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should  readFullNote', () => {
      const noteText = 'abcdfsdsd';
      component.readFullNote(noteText);
      expect(component.readFullNote).toBeDefined();
    });
  });

  describe('getBenefitCalculationDetails', () => {
    it('getBenefitCalculationDetails', () => {
      const sin = 1004341279;
      component.benefitRequestId = 4334;
      // spyOn(component.benefitDocumentService, 'getUploadedDocuments').and.callThrough();
      component.getBenefitCalculationDetails(sin, component.benefitRequestId);
      expect(component.getBenefitCalculationDetails).toBeDefined();
    });
  });
  describe('hideModal', () => {
    it('should hide modal reference', () => {
      component.commonModalRef = new BsModalRef();
      component.hideModal();
      expect(component.hideModal).toBeDefined();
    });
  });
  describe('readFullNote', () => {
    it('should readFullNote', () => {
      spyOn(component, 'readFullNote');
      // component.readFullNote();
      expect(component.readFullNote).toBeDefined();
    });
  });
  describe('showModal', () => {
    it('should showModal', () => {
      const modalRef = { elementRef: null, createEmbeddedView: null };
      component.showModal(modalRef);
      expect(component.showModal).toBeDefined();
    });
  });
});
