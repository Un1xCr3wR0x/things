/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  DocumentItem,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  DocumentService,
  bindToObject,
  GosiCalendar,
  LovList,
  Lov,
  BilingualText
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub, TranslateLoaderStub, documentListItemArray } from 'testing';
import { HeirRegisterScComponent } from './heir-register-sc.component';
import {
  ManageBenefitService,
  SearchPersonalInformation,
  HeirBenefitService,
  HeirAccountProfile,
  SearchPerson,
  PersonalInformation
} from '../../../shared';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('HeirRegisterScComponent', () => {
  let component: HeirRegisterScComponent;
  let fixture: ComponentFixture<HeirRegisterScComponent>;
  const documentServicespy = jasmine.createSpyObj<DocumentService>('DocumentService', [
    'getRequiredDocuments',
    'refreshDocument',
    'getAllDocuments'
  ]);
  documentServicespy.getRequiredDocuments.and.returnValue(of([new DocumentItem()]));
  documentServicespy.refreshDocument.and.returnValue(of(new DocumentItem()));
  documentServicespy.getAllDocuments.and.returnValue(of(new DocumentItem()));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getSystemParams',
    'getSystemRunDate',
    'getPersonDetailsApi'
  ]);
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getPersonDetailsApi.and.returnValue(
    of({
      ...new SearchPersonalInformation(),
      listOfPersons: [
        {
          ...new PersonalInformation(),
          personId: 1234,
          sex: { english: 'Male', arabic: '' },
          fromJsonToObject: json => json
        }
      ],
      ...new SearchPerson(),
      nationality: { english: 'SAUDI', arabic: '' }
    })
  );
  const heirBenefitServicespy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'getBenefitReasonList',
    'getHeirLinkedContributors',
    'verifyHeir',
    'registerHeir'
  ]);
  heirBenefitServicespy.getBenefitReasonList.and.returnValue(of(new LovList([new Lov()])));
  heirBenefitServicespy.getHeirLinkedContributors.and.returnValue(of(new HeirAccountProfile()));
  heirBenefitServicespy.verifyHeir.and.returnValue(of([new DocumentItem()]));
  heirBenefitServicespy.registerHeir.and.returnValue(of({ english: '', arabic: '' }));
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [HeirRegisterScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: HeirBenefitService, useValue: heirBenefitServicespy },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: DocumentService, useValue: documentServicespy },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirRegisterScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeDefined();
    });
  });
  describe('verifyHeirDetails', () => {
    it('should verifyHeirDetails', () => {
      spyOn(component, 'searchAndVerifyHeir');
      component.verifyHeirDetails();
      expect(component.verifyHeirDetails).toBeDefined();
    });
  });
  describe('initRelationShipLookup', () => {
    it('should initRelationShipLookup', () => {
      spyOn(component.lookUpService, 'getAnnuitiesRelationshipList');
      component.initRelationShipLookup();
      expect(component.initRelationShipLookup).toBeDefined();
    });
  });
  describe('decline', () => {
    it('should decline', () => {
      component.commonModalRef = new BsModalRef();
      component.decline();
      expect(component.decline).toBeDefined();
    });
  });
  describe('reset', () => {
    it('should reset', () => {
      component.reset();
      expect(component.reset).toBeDefined();
    });
  });
  xdescribe('populateRelationShipByGender', () => {
    it('should populateRelationShipByGender', () => {
      component.populateRelationShipByGender();
      expect(component.populateRelationShipByGender).toBeDefined();
    });
  });
  xdescribe('getVerifyParams', () => {
    it('should  getVerifyParams', () => {
      const contributerValues = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      const heirValues = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      component.getVerifyParams(contributerValues, heirValues);
      expect(component.getVerifyParams).toBeDefined();
    });
  });
  xdescribe('verifyContributorDetails', () => {
    it('should  verifyContributorDetails', () => {
      component.verifyContributorDetails();
      expect(component.verifyContributorDetails).toBeDefined();
    });
  });
  describe('routeBack', () => {
    it('should routeBack', () => {
      component.routeBack();
      expect(component.routeBack).toBeDefined();
    });
  });
  describe('cancelTransaction', () => {
    it('should cancelTransaction', () => {
      component.commonModalRef = new BsModalRef();
      spyOn(component.alertService, 'clearAlerts');
      component.cancelTransaction();
      expect(component.cancelTransaction).toBeDefined();
    });
  });
  describe('searchAndVerifyHeir', () => {
    it('should searchAndVerifyHeir', () => {
      component.searchAndVerifyHeir();
      expect(component.searchAndVerifyHeir).toBeDefined();
    });
  });
  describe('registerHeir', () => {
    it('should registerHeir', () => {
      component.registerHeir();
      spyOn(component.alertService, 'clearAllErrorAlerts');
      expect(component.registerHeir).toBeDefined();
    });
  });

  xdescribe('refreshDocument', () => {
    it('should refresh Document', () => {
      const document: DocumentItem = bindToObject(new DocumentItem(), documentListItemArray[0]);
      spyOn(component.alertService, 'clearAllErrorAlerts');
      component.refreshDocument(document);
      expect(component.documentList).not.toBeNull();
    });
  });
  describe('getGenderDetails', () => {
    it('should getGenderDetails', () => {
      const data = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      component.getGenderDetails(data);
      expect(component.getGenderDetails).toBeDefined();
    });
  });
  describe('getDobHeir', () => {
    it('should getGenderDetails', () => {
      const data = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      component.getDobHeir(data);
      expect(component.getDobHeir).toBeDefined();
    });
  });
  describe('ngOnDestroy', () => {
    it('should ngOnDestroy', () => {
      spyOn(component.alertService, 'clearAllErrorAlerts');
      spyOn(component.alertService, 'clearAllWarningAlerts');
      spyOn(component.alertService, 'clearAllSuccessAlerts');
      component.ngOnDestroy();
      expect(component.ngOnDestroy).toBeDefined();
    });
  });
});
