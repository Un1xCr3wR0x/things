/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  DocumentService,
  EnvironmentToken,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  LanguageToken,
  LookupService,
  Lov,
  LovList,
  MenuService
} from '@gosi-ui/core';
import { BilingualTextPipe } from '@gosi-ui/foundation-theme/src/lib/pipes';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of, throwError } from 'rxjs';
import {
  ActivatedRouteStub,
  AlertServiceStub,
  BilingualTextPipeMock,
  ChangeGroupEstablishmentStubService,
  DocumentServiceStub,
  EstablishmentStubService,
  flagDetailsMock,
  FlagEstablishmentStubService,
  genericError,
  genericEstablishmentResponse,
  LookupServiceStub,
  ModalServiceStub
} from 'testing';
import {
  ChangeGroupEstablishmentService,
  EstablishmentConstants,
  EstablishmentService,
  FilterKeyEnum,
  FilterKeyValue,
  FlagEstablishmentService,
  FlagFilter
} from '../../../shared';
import { ActiveFlagsDcComponent } from '../active-flags-dc/active-flags-dc.component';
import { FlagHistoryDcComponent } from '../flag-history-dc/flag-history-dc.component';
import { ViewFlagDetailsScComponent } from './view-flag-details-sc.component';

export const activatedRouteStub: ActivatedRouteStub = new ActivatedRouteStub({ regNo: 987654321 });

const locationMock = { back: jasmine.createSpy('back') };
export const routerSpy = { url: '', navigate: jasmine.createSpy('navigate') };
const httpSpy = { get: jasmine.createSpy('get'), post: jasmine.createSpy('put') };

describe('ViewFlagDeatilsScComponent', () => {
  let component: ViewFlagDetailsScComponent;
  let fixture: ComponentFixture<ViewFlagDetailsScComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserDynamicTestingModule
      ],
      declarations: [ViewFlagDetailsScComponent],
      providers: [
        {
          provide: EstablishmentService,
          useClass: EstablishmentStubService
        },
        { provide: DocumentService, useClass: DocumentServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: HttpClient, useValue: httpSpy },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: ChangeGroupEstablishmentService,
          useClass: ChangeGroupEstablishmentStubService
        },
        {
          provide: FlagEstablishmentService,
          useClass: FlagEstablishmentStubService
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: BilingualTextPipe, useClass: BilingualTextPipeMock },
        { provide: LanguageToken, useValue: new BehaviorSubject('en') },
        { provide: ApplicationTypeToken, useValue: ApplicationTypeEnum.PRIVATE },
        { provide: EstablishmentToken, useValue: new EstablishmentRouterData() },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Location, useValue: locationMock },
        { provide: LookupService, useClass: LookupServiceStub },
        {
          provide: MenuService,
          useValue: {
            getRoles() {
              return [];
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(ViewFlagDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ng On init', () => {
    it('should initialise the view with error', () => {
      (activatedRouteStub as any).paramMap = of(convertToParamMap({ regNo: undefined }));
      spyOn(component, 'initialiseFromRoutes').and.callThrough();
      spyOn(component, 'viewFlagDetails').and.callThrough();
      component.ngOnInit();
      expect(component.initialiseFromRoutes).toHaveBeenCalled();
    });
    it('should initialise the view', () => {
      (activatedRouteStub as any).paramMap = of(
        convertToParamMap({ regNo: genericEstablishmentResponse.registrationNo })
      );
      activatedRouteStub.paramMap.subscribe(params => {
        component.estRegNo = +params.get('regNo');
      });

      spyOn(component, 'initialiseFromRoutes').and.callThrough();
      spyOn(component, 'viewFlagDetails').and.callThrough();
      component.ngOnInit();
      expect(component.initialiseFromRoutes).toHaveBeenCalled();
    });
  });

  describe('User Select tab', () => {
    it('should select the tab', () => {
      component.historyFlagComponent = { cancelFilter: () => {} } as any as FlagHistoryDcComponent;
      component.activeFlagComponent = { cancelFilter: () => {} } as any as ActiveFlagsDcComponent;
      component.selectTab(component.tabs[0].key);
      expect(component.selectedTab).toEqual(component.tabs[0].key);
    });
  });
  describe('User Select tab', () => {
    it('should select the tab', () => {
      component.historyFlagComponent = { cancelFilter: () => {} } as any as FlagHistoryDcComponent;
      component.activeFlagComponent = { cancelFilter: () => {} } as any as ActiveFlagsDcComponent;
      component.selectTab(component.tabs[0].key);
      expect(component.selectedTab).toEqual(component.tabs[0].key);
    });
  });

  describe('viewFlagDetails', () => {
    it('should call viewFlagDetails', () => {
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(of([flagDetailsMock]));
      component.viewFlagDetails();
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.activeFlags).toBeDefined();
    });
    it('should call viewFlagDetails with error', () => {
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.viewFlagDetails();
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });

  describe('getFlagHistory', () => {
    it('should call getFlagHistory', () => {
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(of([flagDetailsMock]));
      const flagRequest = new FlagFilter();
      flagRequest.transactionId = 1234;
      const lov = new Lov();
      lov.sequence = 1;
      lov.value = flagDetailsMock.flagReason;
      flagRequest.sortBy = lov;
      flagRequest.sortOrder = 'desc';
      flagRequest.flagType = {
        arabic: 'إيقاف الشهادة عن منشأة',
        english: 'Stop GOSI certificate'
      };
      const filterKeyValue1 = new FilterKeyValue();
      filterKeyValue1.key = FilterKeyEnum.REASON;
      filterKeyValue1.value = '123';
      filterKeyValue1.bilingualValues = [
        {
          arabic: 'إيقاف الشهادة عن منشأة',
          english: 'test reason'
        }
      ];
      const filterKeyValue2 = new FilterKeyValue();
      filterKeyValue2.key = FilterKeyEnum.PERIOD;
      filterKeyValue2.values = ['2020-04-14T00:00:00.000Z'];
      const filterKeyValue3 = new FilterKeyValue();
      filterKeyValue3.key = FilterKeyEnum.APPLIED_BY;
      filterKeyValue3.bilingualValues = [
        {
          arabic: '1001',
          english: '1001'
        }
      ];

      flagRequest.flagFilter = [filterKeyValue1, filterKeyValue2, filterKeyValue3];
      component.getFlagHistory(flagRequest);
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.flagHistory).toBeDefined();
    });
    it('should call getFlagHistory with error', () => {
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      const flagRequest = new FlagFilter();
      const filterKeyValue = new FilterKeyValue();
      filterKeyValue.key = FilterKeyEnum.ROLES;
      flagRequest.flagFilter = [filterKeyValue];
      component.getFlagHistory(flagRequest);
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
    it('should call getFlagHistory with same reason list', () => {
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(of([flagDetailsMock, flagDetailsMock]));

      const flagRequest = new FlagFilter();
      const filterKeyValue = new FilterKeyValue();
      filterKeyValue.key = FilterKeyEnum.ROLES;
      flagRequest.flagFilter = [filterKeyValue];
      component.historyFlagReasons = undefined;
      component.historyCreationTypeLovList = undefined;
      component.getFlagHistory(flagRequest);
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
    });
  });
  describe('getFlagReasonsLov', () => {
    const list = new LovList([]);
    const lov = new Lov();
    lov.sequence = 1;
    lov.value = flagDetailsMock.flagReason;
    list.items.push(lov);
    it('should call getFlagReasonsLov', () => {
      expect(component.getFlagReasonsLov([flagDetailsMock])).toEqual(list);
    });
  });
  describe('getEstablishment', () => {
    it('should call getEstablishment', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(of(new Establishment()));
      component.getEstablishment();
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
      expect(component.establishment).toBeDefined();
    });
    it('should call getFlagHistory with error', () => {
      spyOn(component.establishmentService, 'getEstablishment').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.getEstablishment();
      expect(component.establishmentService.getEstablishment).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
  describe('navigate to modify flag', () => {
    it('should naviagte to modify flag', () => {
      const refernceNo = 1234;
      component.estRegNo = 567465465;
      component.navigateToModifyFlag(refernceNo);
      expect(component.router.navigate).toHaveBeenCalledWith([
        EstablishmentConstants.MODIFY_FLAG_ROUTE(component.estRegNo, refernceNo)
      ]);
    });
  });
  describe('navigate to back', () => {
    it('should naviagte to back', () => {
      spyOn(component.location, 'back');
      component.navigateBack();
      expect(component.location.back).toHaveBeenCalled();
    });
  });
  describe('add flag', () => {
    it('should add flag', () => {
      component.restrictAddFlagTemplate = { elementRef: null, createEmbeddedView: null };
      component.establishment.status.english == 'closed';
      spyOn(component, 'showModal');
      component.addFlag();
      expect(component.showModal).toHaveBeenCalled();
    });
    it('should add flag', () => {
      component.establishment.status.english = 'Registered';
      component.addFlag();
      expect(component.router.navigate).toHaveBeenCalledWith([EstablishmentConstants.ADD_FLAG_ROUTE()]);
    });
  });
  describe('searchActiveFlags', () => {
    it('should call searchActiveFlags', () => {
      const flagRequest = new FlagFilter();
      component.estRegNo = 567465465;
      flagRequest.transactionId = 840300;
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(of([flagDetailsMock]));
      component.searchActiveFlags(flagRequest);
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
    });
    it('should call searchActiveFlags with error', () => {
      const flagRequest = new FlagFilter();
      flagRequest.transactionId = 840300;
      component.estRegNo = 567465465;
      spyOn(component.flagService, 'getFlagDetails').and.returnValue(throwError(genericError));
      spyOn(component.alertService, 'showError');
      component.searchActiveFlags(flagRequest);
      expect(component.flagService.getFlagDetails).toHaveBeenCalled();
      expect(component.alertService.showError).toHaveBeenCalled();
    });
  });
});
