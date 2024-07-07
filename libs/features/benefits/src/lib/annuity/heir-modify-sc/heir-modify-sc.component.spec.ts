/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SimpleChanges, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ApplicationTypeToken,
  ContactDetails,
  EnvironmentToken,
  LanguageToken,
  RouterData,
  RouterDataToken,
  BilingualText,
  GosiCalendar,
  LovList,
  Lov
} from '@gosi-ui/core';
import { ManagePersonService } from '@gosi-ui/features/customer-information/lib/shared';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, of } from 'rxjs';
import { ManagePersonServiceStub, ModalServiceStub, TranslateLoaderStub } from 'testing';
import {
  DependentDetails,
  DependentModify,
  ManageBenefitService,
  PersonalInformation,
  ValidateRequest,
  HeirStatus,
  HeirBenefitService,
  AddHeir,
  UnbornEdit,
  SearchPerson
} from '../../shared';
import { HeirModifyScComponent } from './heir-modify-sc.component';
import { SystemParameterWrapper } from '@gosi-ui/features/contributor';

describe('HeirModifyScComponent', () => {
  let component: HeirModifyScComponent;
  let fixture: ComponentFixture<HeirModifyScComponent>;
  const heirBenefitServiceSpy = jasmine.createSpyObj<HeirBenefitService>('HeirBenefitService', [
    'validateHeir',
    'addHeir',
    'deleteHeir',
    'setHeirUpdateWarningMsg'
  ]);
  const heir: AddHeir = {
    message: { english: '', arabic: '' },
    referenceNo: 2323
  };
  heirBenefitServiceSpy.deleteHeir.and.returnValue(of({ english: '', arabic: '' }));
  heirBenefitServiceSpy.validateHeir.and.returnValue(
    of([
      {
        ...new ValidateRequest(),
        actionType: 'jhg',
        unborn: { ...new UnbornEdit(), reasonForModification: { english: '', arabic: '' } }
      }
    ])
  );
  heirBenefitServiceSpy.addHeir.and.returnValue(of(heir));
  const manageBenefitServiceSpy = jasmine.createSpyObj<ManageBenefitService>('ManageBenefitService', [
    'getModificationReason',
    'getPersonDetailsWithPersonId',
    'getSystemParams',
    'getSystemRunDate'
  ]);
  manageBenefitServiceSpy.getModificationReason.and.returnValue(of([{ english: '', arabic: '' }]));
  manageBenefitServiceSpy.getSystemRunDate.and.returnValue(of(new GosiCalendar()));
  manageBenefitServiceSpy.getPersonDetailsWithPersonId.and.returnValue(of(new PersonalInformation()));
  manageBenefitServiceSpy.getSystemParams.and.returnValue(of([new SystemParameterWrapper()]));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderStub }
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [HeirModifyScComponent],
      providers: [
        {
          provide: RouterDataToken,
          useValue: new RouterData()
        },
        { provide: ManageBenefitService, useValue: manageBenefitServiceSpy },
        { provide: HeirBenefitService, useValue: heirBenefitServiceSpy },
        {
          provide: LanguageToken,
          useValue: new BehaviorSubject<string>('en')
        },
        {
          provide: EnvironmentToken,
          useValue: "{'baseUrl':'localhost:8080/'}"
        },
        { provide: BsModalService, useClass: ModalServiceStub },
        { provide: ManagePersonService, useClass: ManagePersonServiceStub },
        { provide: ApplicationTypeToken, useValue: 'PRIVATE' },
        DatePipe,
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirModifyScComponent);
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
      expect(component.initialiseWaivedTowardsLookup).toBeDefined();
    });
  });
  describe('ngOnChanges', () => {
    it('should ngOnChanges', () => {
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      spyOn(component, 'ngOnChanges').and.callThrough();
      const changesObj: SimpleChanges = {
        prop1: new SimpleChange(1, 2, false)
      };
      component.ngOnChanges(changesObj);
      fixture.detectChanges();
      expect(component.ngOnChanges).toBeDefined();
    });
  });
  describe('addAnotherDependent', () => {
    it('should another dependent', () => {
      component.addAnotherDependent();
      expect(component.addAnotherDependent).toBeDefined();
    });
  });
  xdescribe('applyForBenefit', () => {
    xit('should applyForBenefit', () => {
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];

      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
    xit('should applyForBenefit with action type', () => {
      component.heirActionType = 'HOLD';
      component.parentForm = new FormGroup({
        heirDetails: new FormArray([
          new FormGroup({
            checkBoxFlag: new FormControl(true),
            eachPerson: new FormGroup({
              statusChange: new FormGroup({
                reasonSelect: new FormGroup({
                  english: new FormControl(''),
                  arabic: new FormControl('')
                }),
                waiveBenefit: new FormGroup({
                  english: new FormControl(''),
                  arabic: new FormControl('')
                }),
                reasonNotes: new FormControl('')
              })
            })
          })
        ])
      });
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      //component.savedDependents = [{... new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: (data) => {} }];
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
  });
  describe('getModificationReason', () => {
    it('should getModificationReason', () => {
      component.sin = 1234;
      component.benefitRequestId = 1234;
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.getModificationReason(1234, 0);
      expect(component.getModificationReason).toBeDefined();
    });
    it('should getModificationReason', () => {
      component.sin = 1234;
      component.benefitRequestId = 1234;
      component.heirActionType = HeirStatus.HOLD;
      expect(component.heirActionType).toEqual(component.heirActionType);
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.getModificationReason(1234, 0);
      expect(component.getModificationReason).toBeDefined();
    });
    it('should getModificationReason', () => {
      component.sin = 1234;
      component.benefitRequestId = 1234;
      component.heirActionType = HeirStatus.RESTART;
      expect(component.heirActionType).toEqual(component.heirActionType);
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.getModificationReason(1234, 0);
      expect(component.getModificationReason).toBeDefined();
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
      component.heirDetails = [
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
  });

  describe('cancelUnborn', () => {
    it('should cancelUnborn', () => {
      const event = null;
      //  component.cancelUnborn(event);
    });
  });
  describe('getDependentHeirEligibilityStatusModify', () => {
    it('should Active', () => {
      component.getDependentHeirEligibilityStatusModify('Active');
    });
    it('should On Hold', () => {
      component.getDependentHeirEligibilityStatusModify('On Hold');
    });
    it('should Waived towards GOSI', () => {
      component.getDependentHeirEligibilityStatusModify('Waived towards GOSI');
    });
    it('should Waived towards GOSI', () => {
      component.getDependentHeirEligibilityStatusModify('Waived towards heir');
    });
  });

  describe(' getAuthPeronContactDetails', () => {
    it('should  getAuthPeronContactDetails', () => {
      const HeirPersonIds = {
        authPersonId: 12233,
        HeirId: 213212
      };
      component.getAuthPeronContactDetails(HeirPersonIds);
      expect(component.getAuthPeronContactDetails).toBeDefined();
    });
  });
  describe('applyForBenefit', () => {
    it('should applyForBenefit', () => {
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      //component.savedDependents = [{... new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: (data) => {} }];
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
    it('should applyForBenefit with action type', () => {
      component.heirActionType = 'HOLD';
      component.parentForm = new FormGroup({
        listOfHeirs: new FormArray([
          new FormGroup({
            checkBoxFlag: new FormControl(true),
            eachPerson: new FormGroup({
              statusChange: new FormGroup({
                reasonSelect: new FormGroup({
                  english: new FormControl(''),
                  arabic: new FormControl('')
                }),
                waiveBenefit: new FormControl(''),
                reasonNotes: new FormControl('')
              })
            })
          })
        ])
      });
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      // component.savedDependents = [{... new DependentModify(), actionType: '', events: [], personId: 1234, assignValues: (data) => {} }];
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeDefined();
    });
  });
  describe('delete', () => {
    it('should  delete', () => {
      const heirDetail = {
        ...new DependentDetails(),
        personId: 1234,
        actionType: 'REMOVE',
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.delete(heirDetail);
      expect(component.delete).toBeDefined();
    });
  });
  describe('getDropdownsPopulated', () => {
    it('should getDropdownsPopulated', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        sex: {
          english: ''.toUpperCase(),
          arabic: ''
        },
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.getDropdownsPopulated(perDetails);
      spyOn(component.lookUpService, 'getAnnuitiesRelationshipByGender').and.returnValue(
        of({ ...new LovList([new Lov()]), sex: 'male'.toUpperCase() })
      );
      expect(component.getDropdownsPopulated).toBeDefined();
    });
  });
  describe('editHeirModifyReason', () => {
    it('should  editHeirModifyReason', () => {
      const heir = new DependentModify();
      component.editHeirModifyReason(heir);
      // spyOn(component.heirBenefitService, 'validateHeir').and.returnValue(of([{ ...new ValidateRequest() }]));
      expect(component.editHeirModifyReason).toBeDefined();
    });
  });
  describe('setTableHeading', () => {
    it('should set table heading', () => {
      component.setTableHeading();
      expect(component.setTableHeading).toBeDefined();
    });
  });
  describe('setContactDetail', () => {
    it('should setContactDetail', () => {
      const contact = new ContactDetails();
      const heirId = 12344;
      spyOn(component, 'setContactDetail').and.callThrough();
      component.setContactDetail(contact, heirId);
      expect(component.setContactDetail).toBeDefined();
    });
  });
  // describe('checkForUnborn', () => {
  //   it('should check unborn', () => {
  //     component.checkForUnborn();
  //     expect(component.checkForUnborn).toBeDefined();
  //   });
  // });

  /*describe('createToggleForm', () => {
    it('should create toggle form', () => {
      component.createToggleForm();
      expect(component.createToggleForm).toBeDefined();
    });
  });*/
  // describe('createUnbornForm', () => {
  //   it('should create unborn form', () => {
  //     component.createUnbornForm();
  //     expect(component.createUnbornForm).toBeDefined();
  //   });
  // });
  describe('getScreenSize', () => {
    it('should getScreenSize', () => {
      component.getScreenSize();
      expect(component.getScreenSize).toBeDefined();
    });
  });

  describe('showHeader', () => {
    it('should showHeader', () => {
      const perDetails = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.heirDetails = [
        {
          ...perDetails,
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      component.showHeader();
      expect(component.showHeader).toBeTruthy();
    });
  });
  describe('applyForBenefit', () => {
    it('should apply for benefit', () => {
      spyOn(component, 'applyForBenefit');
      component.applyForBenefit();
      expect(component.applyForBenefit).toBeTruthy();
    });
  });
  xdescribe('updateStatusDateForHeir', () => {
    it('should updateStatusDateForHeir', () => {
      const heir = 233443;
      component.updateStatusDateForHeir(heir);
      expect(component.updateStatusDateForHeir).toBeTruthy();
    });
  });
  describe('updateHeirStatus', () => {
    it('should updateHeirStatus', () => {
      const data = {
        personId: 23344,
        newDependentStatus: {
          arabic: '',
          english: 'unknown'
        }
      };
      component.heirDetails = [
        {
          ...new DependentDetails(),
          personId: 1234,
          fromJsonToObject: json => json,
          setValidatedValues: () => {},
          setSelectedStatus: () => {}
        }
      ];
      fixture.detectChanges();
      component.updateHeirStatus(data);
      component.heirDetails.forEach(heir => {
        if (heir.personId === 23344) {
          component.isNewHeirStatus = true;
        }
      });
      expect(component.updateHeirStatus).toBeDefined();
    });
  });
  describe('setHeading', () => {
    it('should setHeading HOLD', () => {
      component.heirActionType = 'HOLD';
      expect(component.heirActionType).toEqual('HOLD');
      component.setHeading();
      expect(component.setHeading).toBeDefined();
    });
    it('should RESTART', () => {
      component.heirActionType = 'RESTART';
      expect(component.heirActionType).toEqual('RESTART');
      component.setHeading();
      expect(component.setHeading).toBeDefined();
    });
    it('should STOP', () => {
      component.heirActionType = 'STOP';
      expect(component.heirActionType).toEqual('STOP');
      component.setHeading();
    });
    it('should STOP_WAIVE', () => {
      component.heirActionType = 'STOP_WAIVE';
      expect(component.heirActionType).toEqual('STOP_WAIVE');
      //expect(component.heading).toEqual('BENEFITS.SELECT-HEIRS-STOP-WAIVE');
      component.setHeading();
    });
    it('should START_WAIVE', () => {
      component.heirActionType = 'START_WAIVE';
      expect(component.heirActionType).toEqual('START_WAIVE');
      //expect(component.heading).toEqual('BENEFITS.SELECT-HEIRS-START-WAIVE');
      component.setHeading();
    });
  });
  describe('setActionType', () => {
    it('should set action type for benefit', () => {
      spyOn(component, 'setActionType');
      component.heirActionType = 'HOLD';
      component.isActionStatus = true;
      component.setActionType();
      component.setTableHeading();
      expect(component.setActionType).toBeTruthy();
    });
  });
  //heirbaseComponent
  describe('addHeir', () => {
    it('should addHeir', () => {
      const heir = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.addHeir(heir);
      expect(component.addHeir).toBeDefined();
    });
  });
  describe('validateHeir', () => {
    it('should  validateHeir', () => {
      const heir = {
        ...new DependentDetails(),
        personId: 1234,
        fromJsonToObject: json => json,
        setValidatedValues: () => {},
        setSelectedStatus: () => {}
      };
      component.validateHeir(heir);
      expect(component.validateHeir).toBeDefined();
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
      component.delete(perDetails);
      expect(component.delete).toBeDefined();
    });
  });
});
