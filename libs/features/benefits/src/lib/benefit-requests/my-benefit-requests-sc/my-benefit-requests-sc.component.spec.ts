/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Directive, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationTypeToken, LanguageToken, Lov, LovList, RouterData, RouterDataToken } from '@gosi-ui/core';
import { SearchDcComponent, SortDcComponent } from '@gosi-ui/foundation-theme/src/lib/components';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ActivatedRouteStub, ModalServiceStub, TranslateLoaderStub } from 'testing';
import {
  BenefitOverviewDetails,
  BenefitRequestFilter,
  BenefitRequestsService,
  MyBenefitRequestsResponse
} from '../../shared';
import { BenefitRequestFilterDcComponent } from './benefit-request-filter-dc/benefit-request-filter-dc.component';
import { BenefitsRequestsTabDcComponent } from './benefits-requests-tab-dc/benefits-requests-tab-dc.component';
import { MyBenefitRequestsScComponent } from './my-benefit-requests-sc.component';

describe('MyBenefitRequestsScComponent', () => {
  let component: MyBenefitRequestsScComponent;
  let fixture: ComponentFixture<MyBenefitRequestsScComponent>;
  const sin = 123456789;
  const benefitRequestId = 1234;
  const referenceNo = 1234;
  const benefitRequestsServiceSpy = jasmine.createSpyObj<BenefitRequestsService>('BenefitRequestsService', [
    'getAllBenefitTranscations',
    'getEachNoOfBenefits',
    'getbenefitFilterType'
  ]);
  benefitRequestsServiceSpy.getAllBenefitTranscations.and.returnValue(of(new MyBenefitRequestsResponse()));
  benefitRequestsServiceSpy.getEachNoOfBenefits.and.returnValue(of(new BenefitOverviewDetails()));
  benefitRequestsServiceSpy.getbenefitFilterType.and.returnValue(of(new LovList([new Lov()])));
  /* const modifyPensionServiceSpy = jasmine.createSpyObj<ModifyBenefitService>('ModifyBenefitService', [
    'setActiveBenefit'
  ]);*/
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [MyBenefitRequestsScComponent, BenefitFilterStubComponent, BenefitRequestTabStubComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BenefitRequestsService, useValue: benefitRequestsServiceSpy },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BenefitRequestFilterDcComponent, useClass: BenefitFilterStubComponent },
        { provide: BenefitsRequestsTabDcComponent, useClass: BenefitRequestTabStubComponent },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        FormBuilder,
        DatePipe,
        // { provide: ModifyBenefitService, useValue: modifyPensionServiceSpy },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        {
          provide: Router,
          useValue: routerSpy
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBenefitRequestsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should ngOnInit', () => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeDefined();
  });
  it('should getBenefitTransactions', () => {
    component.currentPage = 1;
    component.itemsPerPage = 10;
    component.transactionStatus = 'Active';
    component.benefitGroup = '';
    component.benefitRequestFilter = new BenefitRequestFilter();
    component.getBenefitTransactions();
    expect(component.myBenefitRequestsResponse).not.toEqual(null);
  });
  it('should getBenefitOverview', () => {
    component.getBenefitOverview();
    expect(component.benefitOverviewResponse).not.toEqual(null);
  });
  it('should onBenefitEntryCLick', () => {
    const selectedBenefit = {
      sin: sin,
      benefitRequestId: benefitRequestId,
      benefitType: { english: '', arabic: '' },
      referenceNo: referenceNo
    };
    component.onBenefitEntryCLick(selectedBenefit);
    expect(component.router.navigate).toHaveBeenCalled();
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  it('should selectPage', () => {
    component.currentPage = 1;
    component.itemsPerPage = 10;
    component.transactionStatus = 'Active';
    component.benefitGroup = '';
    component.benefitRequestFilter = new BenefitRequestFilter();
    component.pageDetails = { currentPage: 0, goToPage: '' };
    component.selectPage(1);
    expect(component.currentPage).toEqual(1);
  });
  it('should selectTab', () => {
    component.currentPage = 1;
    component.itemsPerPage = 10;
    component.transactionStatus = 'Active';
    component.benefitGroup = '';
    component.benefitRequestFilter = new BenefitRequestFilter();
    spyOn(component, 'resetFiltersAndPage');
    component.selectTab('Annuity');
    expect(component.benefitStatusButtonEvent).not.toEqual(null);
    expect(component.resetFiltersAndPage).toHaveBeenCalled();
  });
  it('should resetFiltersAndPage', () => {
    component.benefitFilterComponent = new BenefitRequestFilterDcComponent(new FormBuilder());
    component.benefitFilterComponent.requestDateFilterForm = new FormControl({ value: '' });
    component.benefitFilterComponent.benefitTypeFilterForm = new FormGroup({ items: new FormArray([]) });
    component.benefitFilterComponent.searchComponent = new SearchDcComponent();
    component.benefitFilterComponent.sortComponent = new SortDcComponent(new BehaviorSubject('en'), new FormBuilder());
    component.benefitFilterComponent.sortComponent.sortListForm = new FormGroup({ items: new FormArray([]) });
    component.benefitRequestTab = new BenefitsRequestsTabDcComponent();
    component.resetFiltersAndPage();
    expect(component.currentPage).toEqual(1);
  });
  it('should filterTransaction', () => {
    component.currentPage = 1;
    component.itemsPerPage = 10;
    component.transactionStatus = 'Active';
    component.benefitGroup = '';
    component.benefitRequestFilter = new BenefitRequestFilter();
    component.benefitRequestTab = new BenefitsRequestsTabDcComponent();
    component.filterTransaction('');
    expect(component.currentPage).toEqual(1);
  });
  it('should filterRequests', () => {
    component.benefitRequestTab = new BenefitsRequestsTabDcComponent();
    component.filterRequests(new BenefitRequestFilter());
    expect(component.currentPage).toEqual(1);
  });
  it('should checkbenefitStatusButtonEvent', () => {
    component.checkbenefitStatusButtonEvent('OnHold');
    expect(component.benefitStatusButtonEvent.onHold).toEqual(true);
  });
  it('should checkbenefitStatusButtonEvent', () => {
    component.checkbenefitStatusButtonEvent('Active');
    expect(component.benefitStatusButtonEvent.active).toEqual(true);
  });
  it('should checkbenefitStatusButtonEvent', () => {
    component.checkbenefitStatusButtonEvent('Stopped');
    expect(component.benefitStatusButtonEvent.stopped).toEqual(true);
  });
  it('should checkbenefitStatusButtonEvent', () => {
    component.checkbenefitStatusButtonEvent('Waived');
    expect(component.benefitStatusButtonEvent.waived).toEqual(true);
  });
});
@Directive({
  selector: '[pmtBenefitFilter]'
})
export class BenefitFilterStubComponent {
  direction = '';
  requestDateFilterForm = new FormControl({ value: '' });
  benefitTypeFilterForm = new FormGroup({ items: new FormArray([]) });
  constructor() {}
  clearAllFiters() {}
  resetSearch() {}
  resetSort() {}
}
@Directive({
  selector: '[pmtBenefitTab]'
})
export class BenefitRequestTabStubComponent {
  constructor() {}
  resetPage() {}
}
