/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  CoreBenefitService,
  CoreActiveBenefits,
  GosiCalendar
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src/lib/pipes/bilingual-text.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  BilingualTextPipeMock,
  ManagePersonServiceStub,
  ModalServiceStub,
  NameToStringPipeMock,
  genericError
} from 'testing';
import {
  BenefitDetails,
  DependentDetails,
  DependentHistoryFilter,
  DependentTransaction,
  HeirBenefitList,
  HeirBenefitService,
  AnnuityResponseDto,
  ManageBenefitService,
  EachHeirDetail
} from '../../shared';
import { ActiveHeirBenefitScComponent } from './active-heir-benefit-sc.component';
import { NameToString } from '@gosi-ui/foundation-theme/src';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('ActiveHeirBenefitScComponent', () => {
  let component: ActiveHeirBenefitScComponent;
  let fixture: ComponentFixture<ActiveHeirBenefitScComponent>;
  const coreBenefitServiceSpy = jasmine.createSpyObj<CoreBenefitService>('CoreBenefitService', [
    'getSavedActiveBenefit',
    'setActiveBenefit'
  ]);
  coreBenefitServiceSpy.getSavedActiveBenefit.and.returnValue(
    new CoreActiveBenefits(122343, 454565, { arabic: 'التعطل عن العمل (ساند)', english: 'Pension Benefits' }, 2323)
  );
  const heirServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getHeirBenefit',
    'getHeirBenefitHistory',
    'filterHeirHistory',
    'getBenefitLists',
    'getHeirById'
  ]);
  heirServiceSpy.getHeirBenefit.and.returnValue(of([new DependentDetails()]));
  heirServiceSpy.getHeirBenefitHistory.and.returnValue(of([new DependentTransaction()]));
  heirServiceSpy.filterHeirHistory.and.returnValue(of([new DependentTransaction()]));
  heirServiceSpy.getBenefitLists.and.returnValue(of([new HeirBenefitList()]));
  heirServiceSpy.getHeirById.and.returnValue(of([new DependentDetails()]));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getAnnuityBenefitRequestDetail',
    'getBenefitCalculationDetailsByRequestId',
    'getSystemParams',
    'getSystemRunDate'
  ]);
  manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(of(new AnnuityResponseDto()));
  manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(of(new BenefitDetails()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      declarations: [ActiveHeirBenefitScComponent, BilingualTextPipeMock, NameToStringPipeMock],
      providers: [
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        {
          provide: BilingualTextPipe,
          useClass: BilingualTextPipeMock
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: HeirBenefitService, useValue: heirServiceSpy },
        { provide: CoreBenefitService, useValue: coreBenefitServiceSpy },
        { provide: NameToString, useClass: NameToStringPipeMock },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        FormBuilder,
        DatePipe
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveHeirBenefitScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.newTab = true;
      component.referenceNo = 10015003;
      expect(component.newTab && component.sin && component.benefitRequestId).toBeDefined();
      spyOn(component, 'getHeirBenefitDetails').and.callThrough;
      spyOn(component, 'getSystemParamAndRundate').and.callThrough();
      spyOn(component, 'getActiveBenefitDetails').and.callThrough();
      spyOn(component, 'getHeirBenefitHistoryDetails').and.callThrough();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('getScreenSize', () => {
    it('should getScreenSize', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });
  describe('getActiveBenefitDetails', () => {
    it('should getActiveBenefitDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.getActiveBenefitDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getActiveBenefitDetails).toBeDefined();
    });
    it('should getActiveBenefitDetails error', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.getActiveBenefitDetails(component.sin, component.benefitRequestId, component.referenceNo);
      expect(component.getActiveBenefitDetails).toBeDefined();
      manageBenefitServiceSpy.getAnnuityBenefitRequestDetail.and.returnValue(throwError(genericError));
    });
  });
  describe('getHeirBenefitDetails', () => {
    it('should getHeirBenefitDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 100522;
      component.getHeirBenefitDetails(component.sin, component.benefitRequestId);
      expect(component.getHeirBenefitDetails).toBeDefined();
    });
    it('should getHeirBenefitDetails error', () => {
      component.sin = 230066639;
      component.benefitRequestId = 100522;
      component.getHeirBenefitDetails(component.sin, component.benefitRequestId);
      expect(component.getHeirBenefitDetails).toBeDefined();
      heirServiceSpy.getHeirBenefit.and.returnValue(throwError(genericError));
    });
  });
  describe('setAvailableStatus', () => {
    it('should setAvailableStatus', () => {
      const lists = DependentDetails[1];
      component.setAvailableStatus(lists);
      expect(component.setAvailableStatus).toBeDefined();
    });
  });
  describe('showBenefitWageDetails', () => {
    it('should showBenefitWageDetails', () => {
      const benefitWageDetail = new EachHeirDetail();
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.showBenefitWageDetails(templateRef, benefitWageDetail);
      expect(component.showBenefitWageDetails).toBeDefined();
    });
  });
  describe('closePopup', () => {
    it('should closePopup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.closePopup();
      expect(component.closePopup).toBeDefined();
    });
  });
  describe(' calculateBenefit', () => {
    it('should  calculateBenefit', () => {
      component.sin = 343522323;
      component.benefitRequestId = 123434;
      component.calculateBenefit(component.sin, component.benefitRequestId);
      expect(component.calculateBenefit).toBeDefined();
    });
    it('should calculateBenefit error', () => {
      component.sin = 343522323;
      component.benefitRequestId = 123434;
      component.calculateBenefit(component.sin, component.benefitRequestId);
      manageBenefitServiceSpy.getBenefitCalculationDetailsByRequestId.and.returnValue(throwError(genericError));
    });
  });
  describe('filterHeirHistory', () => {
    it('should filterHeirHistory', () => {
      component.sin = 230066639;
      const dependentHistoryFilter = new DependentHistoryFilter();
      component.benefitRequestId = 1005229;
      component.isHeir = false;
      component.filterHeirHistory(dependentHistoryFilter);
      expect(component.filterHeirHistory).toBeDefined();
    });
    it('should filterHeirHistory error', () => {
      component.sin = 230066639;
      const dependentHistoryFilter = new DependentHistoryFilter();
      component.benefitRequestId = 1005229;
      component.isHeir = false;
      component.filterHeirHistory(dependentHistoryFilter);
      heirServiceSpy.filterHeirHistory.and.returnValue(throwError(genericError));
    });
  });
  describe('navigateToModifyHeir', () => {
    it('should navigateToModifyHeir', () => {
      component.navigateToModifyHeir();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe(' navigateToModify', () => {
    it('should  navigateToModify', () => {
      component.navigateToModify();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' holdHeirDependent', () => {
    it('should  holdHeirDependent', () => {
      component.isHeir = true;
      component.holdHeirDependent();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('modifyBenefit', () => {
    it('should modifyBenefit', () => {
      component.modifyBenefit();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe(' startBenefitWaive', () => {
    it('should  startBenefitWaive', () => {
      component.isHeir = true;
      component.startBenefitWaive();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('stopBenefitWaive', () => {
    it('should stopBenefitWaive', () => {
      component.isHeir = true;
      component.stopBenefitWaive();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('getBenefitHistoryDetails', () => {
    it('should getBenefitHistoryDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.isHeir = false;
      spyOn(component.dependentService, 'getBenefitHistory').and.returnValue(of([{ ...new BenefitDetails() }]));
      component.getBenefitHistoryDetails(component.sin, component.benefitRequestId);
      expect(component.getBenefitHistoryDetails).toBeDefined();
    });
    it('should getBenefitHistoryDetails error', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.getBenefitHistoryDetails(component.sin, component.benefitRequestId);
      expect(component.getBenefitHistoryDetails).toBeDefined();
      spyOn(component.dependentService, 'getBenefitHistory').and.returnValue(throwError(genericError));
    });
  });
  describe('getHeirBenefitHistoryDetails', () => {
    it('should heir details', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.getBenefitHistoryDetails(component.sin, component.benefitRequestId);
      component.heirService
        .getHeirById(
          component.sin,
          component.benefitRequestId?.toString(),
          component.referenceNo,
          component.benefitType,
          component.status
        )
        .subscribe(response => {
          expect(response).toBeTruthy();
        });
      spyOn(component, 'setAvailableStatus').and.callThrough();
      spyOn(component, 'getBenefitHistoryDetails').and.callThrough();
      fixture.detectChanges();
      expect(component.getHeirBenefitHistoryDetails).toBeDefined();
    });
    it('should getHeirBenefitHistoryDetails error', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.referenceNo = 10015003;
      component.getHeirBenefitHistoryDetails(component.sin, component.benefitRequestId);
      heirServiceSpy.getHeirBenefitHistory.and.returnValue(throwError(genericError));
    });
  });
  // describe('populateHeirDetailsTableData', () => {
  //   it('should populateHeirDetailsTableData', () => {
  //     spyOn(component, 'populateHeirDetailsTableData');
  //     const heirDetails = new DependentDetails();
  //     const benefitHistoryDetails = new BenefitDetails();
  //     component.populateHeirDetailsTableData(heirDetails, benefitHistoryDetails);
  //     expect(component.populateHeirDetailsTableData).toBeDefined();
  //   });
  // });
  describe('setAvailableStatus', () => {
    it('should setAvailableStatus', () => {
      // const lists = new DependentDetails[0];
      // component.setAvailableStatus(lists);
      spyOn(component, 'setAvailableStatus').and.callThrough();
      fixture.detectChanges();
      expect(component.setAvailableStatus).toBeDefined();
    });
  });
  describe('getHeirBenefitHistoryDetails', () => {
    it('should getHeirBenefitHistoryDetails', () => {
      component.sin = 230066639;
      component.benefitRequestId = 1005229;
      component.getHeirBenefitHistoryDetails(component.sin, component.benefitRequestId);
      component.heirService.getBenefitLists(component.sin, component.benefitRequestId).subscribe(response => {
        expect(response).toBeTruthy();
      });
      expect(component.getHeirBenefitHistoryDetails).not.toBeNull();
    });
  });
  // describe('filterTransactions', () => {
  //   it('should filterTransactions', () => {
  //     const heirFilter = new HeirBenefitFilter();
  //     component.filterTransactions(heirFilter);
  //     spyOn(component, 'defaultPagination').and.callThrough();
  //     spyOn(component, 'defaultSort').and.callThrough();
  //     spyOn(component, 'heirRequestSetter').and.callThrough();
  //     spyOn(component, 'filterHeirBenefitHistoryDetails').and.callThrough();
  //     expect(component.filterTransactions).toBeDefined();
  //   });
  // });
  // describe('defaultPagination', () => {
  //   it('should defaultPagination', () => {
  //     spyOn(component, 'defaultPagination');
  //     component.defaultPagination();
  //     fixture.detectChanges();
  //     expect(component.defaultPagination).toBeDefined();
  //   });
  // });
  // describe('defaultSort', () => {
  //   it('should defaultSort', () => {
  //     spyOn(component, 'defaultSort');
  //     component.defaultSort();
  //     fixture.detectChanges();
  //     expect(component.defaultSort).toBeDefined();
  //   });
  // });
  // describe('heirRequestSetter', () => {
  //   it('should heirRequestSetter', () => {
  //     spyOn(component, 'heirRequestSetter');
  //     component.heirRequestSetter();
  //     fixture.detectChanges();
  //     expect(component.heirRequestSetter).toBeDefined();
  //   });
  // });
  // describe('filterHeirBenefitHistoryDetails', () => {
  //   it('should filterHeirBenefitHistoryDetails', () => {
  //     spyOn(component, 'filterHeirBenefitHistoryDetails');
  //     component.heirService
  //       .filterHeirBenefitByDetail(component.sin, component.benefitRequestId, component.heirFilter)
  //       .subscribe(response => {
  //         expect(response).toBeTruthy();
  //       });
  //     component.filterHeirBenefitHistoryDetails();
  //     fixture.detectChanges();
  //     expect(component.filterHeirBenefitHistoryDetails).toBeDefined();
  //   });
  // });
  describe('navigateToHeirDetails', () => {
    it('should navigateToHeirDetails', () => {
      const heir = new DependentDetails();
      component.navigateToHeirDetails(heir);
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('restartHeirDependent', () => {
    it('should restartHeirDependent', () => {
      component.isHeir = true;
      component.restartHeirDependent();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('stopHeirDependent', () => {
    it('should stopHeirDependent', () => {
      component.isHeir = true;
      component.stopHeirDependent();
      expect(component.router.navigate).toHaveBeenCalled();
    });
  });
  describe('setStatusValues', () => {
    it('should setStatusValues', () => {
      component.setStatusValues();
      expect(component.setStatusValues).toBeDefined();
    });
  });
});
