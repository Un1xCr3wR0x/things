/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeEnum,
  ApplicationTypeToken,
  ContributorToken,
  ContributorTokenDto,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken
} from '@gosi-ui/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub } from 'testing/mock-services';
import { RequestFuneralGrantDetailsScComponent } from './request-funeral-grant-details-sc.component';
import { FuneralBenefitService, FuneralGrantBeneficiaryResponse } from '../../../shared';

const routerSpy = { navigate: jasmine.createSpy('navigate') };

describe('RequestFuneralGrantDetailsScComponent', () => {
  let component: RequestFuneralGrantDetailsScComponent;
  let fixture: ComponentFixture<RequestFuneralGrantDetailsScComponent>;
  const funeralBenefitServicespy = jasmine.createSpyObj<FuneralBenefitService>('FuneralBenefitService', [
    'getBeneficiaryRequestDetails'
  ]);
  funeralBenefitServicespy.getBeneficiaryRequestDetails.and.returnValue(of(new FuneralGrantBeneficiaryResponse()));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot(), BrowserDynamicTestingModule],
      providers: [
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: FuneralBenefitService, useValue: funeralBenefitServicespy },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        { provide: RouterDataToken, useValue: new RouterData() },

        {
          provide: ContributorToken,
          useValue: new ContributorTokenDto(1234)
        },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        DatePipe
      ],
      declarations: [RequestFuneralGrantDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestFuneralGrantDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('returnFuneralGrant', () => {
    it('should show returnFuneralGrant', () => {
      component.funeralGrantForm = new FormGroup({});
      spyOn(component, 'confirmReturn');
      component.confirmReturn(new FormGroup({}));
      component.returnFuneralGrant();
      expect(component.returnFuneralGrant).toBeDefined();
    });
  });
  describe('confirmRejectFuneral', () => {
    it('should show confirmRejectFuneral', () => {
      component.funeralGrantForm = new FormGroup({});
      spyOn(component, 'confirmReject');
      component.confirmReject(new FormGroup({}));
      component.confirmRejectFuneral();
      expect(component.confirmRejectFuneral).toBeDefined();
    });
  });
  describe('confirmApproveFuneral', () => {
    it('should show confirmApproveFuneral', () => {
      component.funeralGrantForm = new FormGroup({});
      spyOn(component, 'confirmApprove');
      component.confirmApprove(new FormGroup({}));
      component.confirmApproveFuneral();
      expect(component.confirmApproveFuneral).toBeDefined();
    });
  });
  describe(' getBeneficiaryDetails', () => {
    it('should  getBeneficiaryDetails', () => {
      component.socialInsuranceNo = 23232;
      component.requestId = 34343;
      component.referenceNo = 34342;
      expect(component.socialInsuranceNo && component.requestId && component.referenceNo).toBeDefined();
      component.getBeneficiaryDetails();
      expect(component.getBeneficiaryDetails).toBeDefined();
    });
  });
});
