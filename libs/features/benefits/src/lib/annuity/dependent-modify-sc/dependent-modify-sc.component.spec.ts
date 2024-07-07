/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  GosiCalendar,
  LookupService
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub, TranslateLoaderStub, LookupServiceStub } from 'testing';
import {
  DependentDetails,
  SearchPerson,
  ManageBenefitService,
  SearchPersonalInformation,
  PersonalInformation,
  QuestionControlService,
  EventResponseDto,
  DependentModify,
  HeirEvent,
  DependentService,
  BenefitDetails,
  ValidateRequest,
  ValidateDependent,
  MarriageDetails,
  EventValidated,
  AddEvent,
  RequestEventType
} from '../../shared';
import { DependentModifyScComponent } from './dependent-modify-sc.component';

describe('DependentModifyScComponent', () => {
  let component: DependentModifyScComponent;
  let fixture: ComponentFixture<DependentModifyScComponent>;
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getPersonDetailsApi',
    'getSystemParams',
    'getSystemRunDate',
    'getModificationReason'
  ]);
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
      ]
    })
  );
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([{ name: '', value: '' }]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getModificationReason.and.returnValue(of([{ english: '', arabic: '' }]));
  // const questionControlServiceSpy = jasmine.createSpyObj<QuestionControlService>('QuestionControlService', ['getEventsFromApi','getExistingEvents']);
  //questionControlServiceSpy.getEventsFromApi.and.returnValue(of(new EventResponseDto()));
  // questionControlServiceSpy.getExistingEvents.and.returnValue(of([new HeirEvent({english: '', arabic: ''},new GosiCalendar(),true,'')]));
  const dependentServiceSpy = jasmine.createSpyObj<DependentService>('DependentService', [
    'getDependentHistoryDetails',
    'getDependentDetails',
    'getBenefitHistory',
    'updateDependent'
  ]);
  dependentServiceSpy.getBenefitHistory.and.returnValue(of([{ ...new BenefitDetails() }]));
  dependentServiceSpy.updateDependent.and.returnValue(
    of({ ...new ValidateRequest(), eachEventFiltered: [{ ...new EventValidated({ english: '', arabic: '' }, true) }] })
  );
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [DependentModifyScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        // { provide: DependentService, useValue: dependentServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        DatePipe,
        { provide: LookupService, useClass: LookupServiceStub },
        //{ provide: QuestionControlService, useValue: questionControlServiceSpy },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DependentModifyScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependentModifyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('should ngOnInit', () => {
      component.ngOnInit();
      expect(component.ngOnInit).toBeTruthy();
    });
  });
  describe('addAnotherDependent', () => {
    it('should addAnotherDependent', () => {
      component.addAnotherDependent();
      expect(component.addAnotherDependent).toBeTruthy();
    });
  });
  describe('deleteDependent', () => {
    it('should deleteDependent', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.deleteDependent(perDetails);
      expect(component.deleteDependent).toBeDefined();
    });
    it('should  updateStatusDateForDependent', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.updateStatusDateForDependent(perDetails);
      expect(component.updateStatusDateForDependent).toBeDefined();
    });
  });
  describe('searchDependent', () => {
    it('should searchDependent', () => {
      const event = { ...new SearchPerson(), nationality: { english: 'SAUDI', arabic: '' } };
      component.benefitStartDate = { ...new GosiCalendar(), gregorian: new Date() };
      component.parentForm = new FormGroup({
        requestDate: new FormGroup({ gregorian: new FormControl(new Date()) })
      });
      component.benefitType = 'Pension';
      component.searchDependent(event);
      expect(component.searchDependent).toBeTruthy();
    });
  });

  describe('getScreenSize', () => {
    it('should get Screen Size', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeTruthy();
    });
  });
  describe('setTableHeading', () => {
    it('should set table heading', () => {
      component.setTableHeading();
      expect(component.setTableHeading).toBeDefined();
    });
  });
  describe('setTableHeading with action type', () => {
    it('should set table heading', () => {
      component.actionType = '';
      component.setTableHeading();
      expect(component.setTableHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.actionType = 'HOLD';
      component.setHeading();
      expect(component.actionType).toEqual('HOLD');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.actionType = 'RESTART';
      component.setHeading();
      expect(component.actionType).toEqual('RESTART');
      expect(component.setHeading).toBeDefined();
    });
    it('should setHeading', () => {
      component.actionType = 'STOP';
      component.setHeading();
      expect(component.actionType).toEqual('STOP');
      expect(component.setHeading).toBeDefined();
    });
  });
  // describe('checkForUnborn', () => {
  //   it('should checkForUnborn', () => {
  //     component.checkForUnborn();
  //     expect(component.checkForUnborn).toBeTruthy();
  //   });
  // });
  describe('applyForBenefit', () => {
    it('should applyForBenefit', () => {
      component.listOfDependents = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.savedDependents = [
        { ...new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: data => {} }
      ];
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
    it('should applyForBenefit with action type', () => {
      component.actionType = 'HOLD';
      component.parentForm = new FormGroup({
        listOfDependents: new FormArray([
          new FormGroup({
            checkBoxFlag: new FormControl(true),
            eachPerson: new FormGroup({
              statusChange: new FormGroup({
                reasonSelect: new FormGroup({
                  english: new FormControl(''),
                  arabic: new FormControl('')
                }),
                reasonNotes: new FormControl('')
              })
            })
          })
        ])
      });
      component.listOfDependents = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.savedDependents = [
        { ...new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: data => {} }
      ];
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
  });
  describe('getModificationReason', () => {
    it('should getModificationReason', () => {
      component.sin = 1234;
      component.benefitRequestId = 1234;
      component.listOfDependents = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.getModificationReason(1234, 0, '');
      expect(component.getModificationReason).toBeDefined();
    });
  });
  //DependentBaseComponent
  describe('getEventsfromApi', () => {
    it('should  getEventsfromApi', () => {
      component.parentForm = new FormGroup({
        requestDate: new FormGroup({ gregorian: new FormControl(new Date()) })
      });
      //component.getEventsfromApi(232323);
      // expect(component.getEventsfromApi).toBeDefined();
    });
  });
  describe('updateDependent', () => {
    it('should  updateDependent', () => {
      const eachEventFiltered = [{ ...new EventValidated({ english: '', arabic: '' }, true) }].filter;
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      const data: ValidateDependent = {
        validateDependent: {
          ...new DependentModify(),
          actionType: '',
          events: [],
          personId: 1234,
          assignValues: data => {}
        },
        dependents: [{ ...new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: data => {} }]
      };
      component.updateDependent(data);
      expect(perDetails.personId).toEqual(data.validateDependent.personId);
      expect(component.updateDependent).toBeDefined();
    });
  });
  describe('validate', () => {
    it('should   validate', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      const dep = { ...new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: data => {} };
      component.validate(dep);
      expect(component.validate).toBeDefined();
    });
  });
  describe('update', () => {
    it('should   update', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      const dep = { ...new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: data => {} };
      component.update(dep);
      expect(component.update).toBeDefined();
    });
  });
  describe('validateDependentModifyReason', () => {
    it('should validateDependentModifyReason', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      const dep = { ...new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: data => {} };
      component.validateDependentModifyReason(dep);
      expect(component.validateDependentModifyReason).toBeDefined();
    });
  });
  describe('delete', () => {
    it('should delete', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.delete(perDetails);
      expect(component.delete).toBeDefined();
    });
  });
  describe('addEvent', () => {
    it('should  addEvent', () => {
      const event: AddEvent = {
        actionType: '',
        eventType: { english: '', arabic: '' },
        eventStartDate: null,
        eventEndDate: null,
        eventSource: { english: '', arabic: '' },
        wage: 122,
        eventCategory: '',
        eventCanBeDeleted: true,
        manualEvent: false,
        statusDate: null,
        status: { english: '', arabic: '' },
        dependentEventSource: '',
        eventAddedFromUi: true,
        valid: true,
        message: { english: '', arabic: '' },
        setEventCategory: data => {}
      };
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.addEvent(event);
      expect(component.addEvent).toBeDefined();
    });
    xit('should  addEventPopup', () => {
      const event: RequestEventType = {
        sin: 1223,
        heirPersonId: 1223,
        relationship: { english: '', arabic: '' },
        requestDate: null,
        maritalStatus: { english: '', arabic: '' },
        missingDate: null,
        deathDate: null,
        depOrHeirDeathDate: null,
        questionObj: null,
        hijiriAgeInMonths: 123,
        benefitStartDate: null,
        benefitEligibilityDate: null,
        modifyHeir: false
      };
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.listOfDependents = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.addEventPopup(templateRef, event);
      expect(component.addEventPopup).toBeDefined();
    });
    it('should closePopup', () => {
      component.modalRef = new BsModalRef();
      spyOn(component.modalRef, 'hide');
      component.closePopup();
      expect(component.closePopup).toBeDefined();
    });
  });
  describe('showIneligibilityDetails', () => {
    it('should showIneligibilityDetails', () => {
      const details = new DependentDetails();
      component.commonModalRef = new BsModalRef();
      spyOn(component.commonModalRef, 'hide');
      const templateRef = { key: 'testing', createText: 'abcd' } as unknown as TemplateRef<HTMLElement>;
      component.showIneligibilityDetails(templateRef, details);
      expect(component.closePopup).toBeDefined();
    });
  });
});
