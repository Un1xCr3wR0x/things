/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {Input, Output, EventEmitter, Directive, Inject} from '@angular/core';
import {
  BilingualText,
  LovList,
  Lov,
  LookupService,
  GosiCalendar,
  BaseComponent,
  AlertService,
  CommonIdentity,
  AlertTypeEnum, RouterDataToken, RouterData
} from '@gosi-ui/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {
  DependentDetails,
  HeirDetailsRequest,
  ValidateRequest,
  EventValidated,
  PersonalInformation,
  Question,
  EventResponseDto,
  RequestEventType,
  AddEvent,
  HeirEvent,
  SystemParameter,
  AnnuityResponseDto,
  AgeInNewLaw,
  SearchPerson,
  EventTypeToMaritalStatus
} from '../../models';
import {QuestionControlService, ModifyBenefitService} from '../../services';
import {MaritalValues, EventCategory, InputControlType, BenefitValues, QuestionTypes, ActionType} from '../../enum';
import {EventsConstants} from '../../constants';
import {
  getMandatoryEventsAdded,
  getIdRemoveNullValue,
  getIdLabel,
  getArabicFullName,
  getTheQuestion,
  toQuestionsFormArray,
  isMotherOrGrandMother,
  setManualEventFlag,
  isFemale,
  removeDuplicateMessages,
  getDuplicateEvents,
  getEventsFormArrayForKey,
  getRequestDateFromForm,
  getMaritalEventToPopulate,
  getEventsForCategory,
  getOldestEventFromNicEvents,
  maritalStatusForEventType,
  modifyEventsAfterOdmValidation,
  filterOutOdmRemovedEventsFromEvents,
  getEventsForMaritalStatus,
  setMariatalEvent,
  deleteNonRemovableEvent,
  sortEventAscending, isWifeHusband
} from '../../utils';
import {MaxLengthEnum} from '../../enum/max-length';

@Directive()
export abstract class HeirDependentAddEditBaseComponent extends BaseComponent {
  //local varibles
  // savedIBANNumber: string;
  @Input() systemRunDate: GosiCalendar;
  @Input() isHeir = false;
  @Input() update = false;
  @Input() reasonForBenefit: HeirDetailsRequest; //Only available for Heir
  @Input() benefitStartDate: GosiCalendar;
  @Input() eligibilityStartDate: GosiCalendar; //Only for dependent
  @Input() events: EventResponseDto = new EventResponseDto();
  // @Input() dependentForm: FormGroup;
  @Input() dependentDetails: DependentDetails = new DependentDetails(); //PersonalInformation;
  @Input() annuityResponse: AnnuityResponseDto;
  @Input() annuityRelationShipList: LovList;
  @Input() maritalStatusList: LovList;
  @Input() heirStatusList: LovList;
  @Input() systemParameter: SystemParameter;
  @Input() totalWage = 0;
  @Input() heirStatusArr: string[];
  @Input() benefitType: string;
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() addedEvent: AddEvent;
  @Input() validateApiResponse: ValidateRequest;
  @Input() bankName: BilingualText;
  @Input() requestDate: GosiCalendar;
  @Input() isPension = false;
  @Input() personStatus: PersonalInformation;
  @Input() lang = 'en';
  @Input() isValidator: boolean;
  @Input() ageInNewLaw: AgeInNewLaw[] = [];
  //using for 400 response flow
  @Input() genderList: LovList;
  @Input() searchPersonData: SearchPerson;
  @Input() calcHijiriAgeInMonths: number;
  @Input() isDraft = false;
  @Input() isModifyPage: boolean;
  //For not only for retirement pension
  @Input() requestDateChangedByValidator: boolean;
  @Input() authorizedPersonId: number;

  /**
   * Output
   */
  @Output() saveDependent = new EventEmitter();
  @Output() validateDependent: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() reset = new EventEmitter();
  @Output() cancelEdit = new EventEmitter();
  // @Input() eventTypeList: LovList;
  @Output() addEvent: EventEmitter<RequestEventType> = new EventEmitter();
  @Output() getBankName: EventEmitter<number> = new EventEmitter();
  // getEvents Used only in modify scenario
  @Output() getEvents: EventEmitter<number> = new EventEmitter();
  @Output() isThisAgeInNewLaw: EventEmitter<AgeInNewLaw[]> = new EventEmitter<AgeInNewLaw[]>();
  @Output() getAuthPersonForId: EventEmitter<string> = new EventEmitter<string>();
  @Output() getGuardianForId: EventEmitter<string> = new EventEmitter<string>();

  @Input() listYesNo$ = new Observable<LovList>();
  cityList$: Observable<LovList>;
  countryList$: Observable<LovList>;
  hijiriAgeInMonths: number;
  dependentForm = new FormGroup({});
  selectedRelationship: Lov;
  selectedMartialStatus: BilingualText;
  showGuardian = false;
  isDepRelationEditable = false;
  idValue: string;
  idLabel: string;
  questions: Question[] = [];
  questionsForm = new FormArray([]);
  benefitEligibilityPeriod: number;
  isDeathOrMissingDateInNewLaw = false;
  ageOnEligibilityDate: number;
  isAlive = true;
  isHeirDisabled = false;
  isEligible = true;
  deathStatusDisplay = false;
  birthdate: moment.Moment;
  quesInfo: string;
  isEligibilityDateInNewLaw: boolean;
  eligibilityStartDateInDateFormat: moment.Moment;
  maritalStatusDateUpdatedFromUi = false;
  mothersList = new LovList([]);
  requestDateInMoment: moment.Moment;
  eventErrorWithoutEventCategory: EventValidated[] = [];
  depHeirDeathDate: moment.Moment;
  depHeirDeadBeforeEligibility: boolean;
  maritalStatusEvents: string[] = [MaritalValues.married, MaritalValues.divorcee, MaritalValues.widower];
  //marital status date from oldest/latest event
  statusDate: moment.Moment;
  status: BilingualText;
  isModifyBackdated = false;
  currentDate: Date;
  //new dependent add edit
  MAX_LENGTH_ENUM = MaxLengthEnum;
  personDetailsForm: FormGroup;
  dependentDetailsBeforeValidation: DependentDetails = {} as DependentDetails;
  latestEvent: HeirEvent;

  constructor(
    readonly fb: FormBuilder,
    public modifyPensionService: ModifyBenefitService,
    readonly alertService: AlertService,
    readonly lookupService: LookupService,
    readonly qcs: QuestionControlService,
    @Inject(RouterDataToken) readonly routerData: RouterData
  ) {
    super();
    this.questionsForm = this.fb.array([]);
    this.dependentForm = this.fb.group({
      heirList: this.fb.group({english: null, arabic: null}),
      relationship: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      checkBoxForAlive: false
    });
  }

  /*
   * This method is for calculating age
   */
  calculateAgeAndEligibility(eligibleForPensionReform = false) {
    this.birthdate =
      this.dependentDetails.birthDate ?
        moment(this.dependentDetails.birthDate.gregorian) :
        moment(this.dependentDetails.dateOfBirth.gregorian);
    const thisDay = moment(this.systemRunDate?.gregorian);
    this.requestDateInMoment = this.requestDate ? moment(this.requestDate?.gregorian?.toString()) : thisDay;
    //TODO: in validator flow check if its added from UI
    // this.isAlive = !this.dependentDetails?.newlyAdded && this.dependentDetails?.deathDate ? false : true;
    if (this.isHeir) {
      // Benefit Eligibility Period = Contributor Death date/Missing date  -  Current Date
      this.eligibilityStartDateInDateFormat = moment(this.reasonForBenefit?.eventDate?.gregorian?.toString()); //Death or Missing Date
      this.isDeathOrMissingDateInNewLaw = this.systemParameter?.OLD_LAW_DATE
        ? this.eligibilityStartDateInDateFormat.isSameOrAfter(moment(this.systemParameter?.OLD_LAW_DATE.toString()))
        : null;
    }
    if (!this.isHeir) {
      //TODO: change it event date not available in dependent
      //TODO: check with eligibilyt strt date
      this.eligibilityStartDateInDateFormat = moment(this.eligibilityStartDate?.gregorian?.toString());
      this.isEligibilityDateInNewLaw = this.systemParameter?.OLD_LAW_DATE
        ? this.eligibilityStartDateInDateFormat.isSameOrAfter(moment(this.systemParameter?.OLD_LAW_DATE.toString()))
        : null;
    }
    this.hijiriAgeInMonths =
      this.dependentDetails.hijiriAgeInMonths || this.dependentDetails.age || this.calcHijiriAgeInMonths;
    if (this.hijiriAgeInMonths < 180) {
      //less than 15 years
      this.showGuardian = true;
    }
    this.benefitEligibilityPeriod = this.eligibilityStartDateInDateFormat.diff(
      moment(this.systemRunDate?.gregorian),
      'days'
    );
    // Pension reform consider only gregorian date
    this.ageOnEligibilityDate =
      (
        !eligibleForPensionReform &&
        this.dependentDetails.ageOnEligibilityDate &&
        this.dependentDetails.ageOnEligibilityDate !== null &&
        this.dependentDetails.ageOnEligibilityDate !== undefined
      ) ?
        this.dependentDetails.ageOnEligibilityDate :
        this.eligibilityStartDateInDateFormat.diff(this.birthdate, 'years', true);
  }

  /**
   * This method is for reset search
   */
  resetSearch() {
    this.resetErrors();
    this.eventErrorWithoutEventCategory = [];
    this.reset.emit();
  }

  createQuestionList(qn: Question) {
    if (qn.events?.length)
      qn.events = sortEventAscending(qn.events);
    if (qn.key === EventsConstants.eventsOnlyText()) {
      //Only one events only question object is enough
      const index = this.questions.findIndex(item => item.key === EventsConstants.eventsOnlyText());
      if (index >= 0) {
        qn.events.forEach(event => {
          const duplicateEvents = getDuplicateEvents(event, this.questions[index].events);
          if (!duplicateEvents.length) this.questions[index]?.events?.push(event);
        });
        // this.questions[index].events = [...this.questions[index].events, ...qn.events];
        this.questions[index].showAddeventButton = qn.showAddeventButton;
      } else {
        this.questions.push(qn);
      }
    } else {
      const qnAlreadyAdded = getTheQuestion(this.questions, qn);
      if (qn && !qnAlreadyAdded.length) this.questions.push(qn);
    }
  }

  createQuestionForm(): FormArray {
    return toQuestionsFormArray(this.questions, this.questionsForm);
  }

  // removeDesabledQnForDeadHeir() {
  //   const disabledQn = new Question('disabled', '');
  //   const qnObjFormArray = deleteQuestionFromQuestionsAndForm(disabledQn, this.questions, this.questionsForm);
  //   if (qnObjFormArray) {
  //     this.questions = qnObjFormArray.qns;
  //     this.questionsForm = qnObjFormArray.frmGrp;
  //   }
  // }

  /**
   *  This method is for making field required
   */
  makeFieldRequired(field: string, date = false, disabled = false) {
    // this.questionsForm = this.createQuestionForm(field);
    let control: FormGroup;
    if (date) {
      control = this.fb.group({
        gregorian: ['', Validators.required],
        hijiri: null
      });
    } else {
      control = this.fb.group({
        english: [null, Validators.required],
        arabic: null
      });
    }
    this.dependentForm.removeControl(field);
    this.dependentForm.addControl(field, control);
    // Without setTimeout the code is not working
    setTimeout(() => (disabled ? this.dependentForm.get(field).disable() : this.dependentForm.get(field).enable()));
  }

  /**
   *  This method is for resetting values
   */
  resetErrors() {
    this.alertService.clearAlerts();
  }

  /**
   *  This method is for filtering heir code
   */
  filterHeirCode(value: string): Lov[] {
    return this.heirStatusList.items.filter(
      lov => lov.value.english.replace(/\s/g, '').toLowerCase() === value.replace(/\s/g, '').toLowerCase()
    );
  }

  filterDependentCode(value: string): Lov[] {
    return this.heirStatusList.items.filter(
      lov => lov.value.english.replace(/\s/g, '').toLowerCase() === value.replace(/\s/g, '').toLowerCase()
    );
  }

  /**
   *  This method is for making relationship not editable whose dependent source is NIC or MOJ
   */
  depRelationEditable() {
    if (
      this.dependentDetails?.dependentSource === BenefitValues.moj ||
      this.dependentDetails.dependentSource === BenefitValues.nic
    ) {
      this.isDepRelationEditable = false;
      this.dependentForm?.get('relationship').patchValue(this.dependentDetails.relationship.english);
    } else {
      this.isDepRelationEditable = true;
    }
  }

  /**
   *  This method is for fetching LOV values
   */
  getLovFromLovList(list: LovList, key: BilingualText) {
    for (const eachValue of list.items) {
      if (eachValue.value.english === key.english) {
        return eachValue;
      }
    }
  }

  /** Initializing cityList variable */
  initialiseCityLookup() {
    this.cityList$ = this.lookupService.getCityList();
  }

  /** Initializing countryList variable */
  initialiseCountryLookup() {
    this.countryList$ = this.lookupService.getCountryList();
  }

  setRelationAndMaritalStatus(relationshipList: LovList) {
    if (this.dependentDetails.relationship) {
      this.dependentForm.get('relationship').patchValue(this.dependentDetails.relationship);
      this.selectedRelationship = this.getLovFromLovList(relationshipList, this.dependentDetails.relationship);
    }
    this.setMaritalStatus();
  }

  setMaritalStatusDate(status: string, maritalStatusDate?: GosiCalendar, fieldDisabled = false) {
    if (status === MaritalValues.single) {
      this.dependentForm.removeControl('maritalStatusDate');
    } else if (status) {
      this.makeFieldRequired('maritalStatusDate', true, fieldDisabled);
      if (maritalStatusDate) {
        //TODO: get this from latest marriage event
        this.dependentForm.get('maritalStatusDate.gregorian').patchValue(moment(maritalStatusDate?.gregorian).toDate());
        this.dependentForm.get('maritalStatusDate.hijiri').patchValue(maritalStatusDate.hijiri);
      }
    }
  }

  /**
   *  This method is for setting input values
   */
  setInputValues(eligibleForPensionReform = false) {
    if (this.dependentDetails.identity) {
      const idObj: CommonIdentity | null = this.dependentDetails.identity.length
        ? getIdRemoveNullValue(this.dependentDetails.identity)
        : null;
      if (idObj) {
        this.idValue = idObj.id.toString();
        this.idLabel = getIdLabel(idObj);
      }
    }
    this.calculateAgeAndEligibility(eligibleForPensionReform);
    this.depRelationEditable();
    this.dependentDetails.nameBilingual = new BilingualText();
    this.dependentDetails.nameBilingual.english = this.dependentDetails.name?.english?.name;
    this.dependentDetails.nameBilingual.arabic = getArabicFullName(this.dependentDetails.name);
    if (this.dependentDetails.maritalInfos && this.dependentDetails.maritalInfos.length > 0) {
      const index = this.isPension ? 0 : this.dependentDetails.maritalInfos.length - 1;
      this.dependentDetails.maritalStatus = this.dependentDetails.maritalInfos[index].maritalStatus;
      this.dependentDetails.maritalStatusDate = this.dependentDetails.maritalInfos[index].eventDate;
      this.dependentDetails.maritalStatusDate.gregorian = moment(
        this.dependentDetails.maritalInfos[index].eventDate.gregorian
      ).toDate();
    }
    // if (this.dependentDetails.motherId && this.mothersList.items.length) {
    //   const selectedMother = this.mothersList.items.filter(eachMother => {
    //     return eachMother.code === this.dependentDetails.motherId;
    //   });
    //   this.dependentForm.addControl('selectMother', this.fb.group(selectedMother));
    // }
    if (this.dependentDetails?.deathDate?.gregorian || this.dependentDetails?.deathDate?.hijiri) {
      this.isAlive = false;
      this.dependentForm.get('deathDate')
        ? this.dependentForm.get('deathDate').patchValue(
        this.fb.group({
          gregorian: [moment(this.dependentDetails.deathDate.gregorian).toDate()],
          hijiri: [null]
        })
        )
        : this.dependentForm.addControl(
        'deathDate',
        this.fb.group({
          gregorian: [moment(this.dependentDetails.deathDate.gregorian).toDate()],
          hijiri: [null]
        })
        );
      // if (this.update && this.dependentDetails.newlyAdded) {
      this.dependentForm.get('checkBoxForAlive')
        ? this.dependentForm.get('checkBoxForAlive').patchValue(true)
        : this.dependentForm.addControl('checkBoxForAlive', new FormControl(true, Validators.required));
      // } else
      if (
        this.isHeir &&
        moment(this.dependentDetails.deathDate.gregorian).isAfter(moment(this.reasonForBenefit.eventDate.gregorian))
      ) {
        this.deathStatusDisplay = true;
      } else if (!this.isHeir) {
        this.deathStatusDisplay = true;
      }
    } else {
      this.dependentForm.addControl('checkBoxForAlive', new FormControl(false, Validators.required));
    }
  }

  addEventPopup(question: Question, modifyHeir = false) {
    // To get event type from api and condition check in addevent popup
    const reqParamEventType = new RequestEventType();
    reqParamEventType.questionObj = question;
    reqParamEventType.modifyHeir = modifyHeir;
    reqParamEventType.hijiriAgeInMonths = this.hijiriAgeInMonths;
    reqParamEventType.heirPersonId = this.dependentDetails?.personId;
    reqParamEventType.relationship = this.selectedRelationship?.value;
    reqParamEventType.benefitStartDate = this.benefitStartDate;
    reqParamEventType.benefitEligibilityDate = {gregorian: this.eligibilityStartDateInDateFormat?.toDate()};
    reqParamEventType.depOrHeirDeathDate = this.dependentForm.get('deathDate')
      ? this.dependentForm.get('deathDate').value
      : null;
    reqParamEventType.maritalStatus = this.dependentForm.get('maritalStatus')
      ? this.dependentForm.get('maritalStatus').value
      : null;
    if (!this.isModifyBackdated) {
      reqParamEventType.requestDate = this.parentForm.get('requestDate')
        ? getRequestDateFromForm(this.parentForm)
        : this.systemRunDate;
    } else {
      reqParamEventType.requestDate = this.annuityResponse?.requestDate;
    }
    if (this.isHeir) {
      if (
        this.reasonForBenefit?.reason?.english === BenefitValues.missingContributor ||
        this.reasonForBenefit?.reason?.english === BenefitValues.ohMissingContributor
      ) {
        reqParamEventType.missingDate = this.reasonForBenefit?.eventDate;
      } else if (this.reasonForBenefit.reason.english === BenefitValues.deathOfTheContributor) {
        reqParamEventType.deathDate = this.reasonForBenefit?.eventDate;
      } else {
        reqParamEventType.deathDate = this.reasonForBenefit?.eventDate;
      }
    }

    this.addEvent.emit(reqParamEventType);
  }

  // isThisAgeInNewLaw(age: number, dob: Date, newLawDate: string): boolean {
  //   //System parameter name is wrong OLD_LAW_DATE -> New law starting date
  //   const birthDate = moment(dob);
  //   const dateOnAge = birthDate.add(age, 'M');
  //   // return dateOnAge.isSameOrAfter(moment(this.systemParameter.OLD_LAW_DATE.toString()));
  //   return dateOnAge.isSameOrAfter(moment(newLawDate));
  // }

  validated(isModifyBenefit = false, saveButtonDisabled = false) {
    if (this.validateApiResponse.events) {
      let filteredEvents: EventValidated[] = [];
      this.eventErrorWithoutEventCategory = this.validateApiResponse.events.filter(
        event => !event.eventCategory && !event.valid && event.message?.english
      );
      this.questions.forEach((qn, index) => {
        if (this.questionsForm.at(index)?.get(qn.key)?.value === qn.addEventForAnswer) {
          // if question is answered then the error will be shown
          qn.eventValidationErrorResponse = this.validateApiResponse.events.filter(
            event => !event.valid && event.eventCategory === EventCategory[qn.key] && event.message?.english
          );
          qn.eventValidationErrorResponse = removeDuplicateMessages(qn.eventValidationErrorResponse);
          filteredEvents = filteredEvents.concat(qn.eventValidationErrorResponse);
        }
      });
      filteredEvents = filteredEvents.concat(this.eventErrorWithoutEventCategory);
      this.eventErrorWithoutEventCategory = this.eventErrorWithoutEventCategory.concat(
        this.validateApiResponse.events.filter(
          r => r.message?.english && !filteredEvents.some(f => f.message?.english === r.message?.english)
        )
      );
    }
    if (
      !this.validateApiResponse.validEvent &&
      !this.validateApiResponse.valid &&
      this.validateApiResponse.message?.english
    ) {
      //getting outside message from valid response
      this.eventErrorWithoutEventCategory.push(new EventValidated(this.validateApiResponse.message, false));
    }
    //For Heir only
    if (this.isHeir) {
      //Validation needed to add the contact details
      if (this.validateApiResponse.validatedHeir)
        Object.assign(this.dependentDetails, this.validateApiResponse.validatedHeir);
      if (this.validateApiResponse.validEvent) this.eventErrorWithoutEventCategory = [];
      if (isModifyBenefit && !this.validateApiResponse.surplus) {
        modifyEventsAfterOdmValidation(this.questionsForm, this.validateApiResponse.events);
      }
    }
    this.eventErrorWithoutEventCategory = removeDuplicateMessages(this.eventErrorWithoutEventCategory || []);
    this.dependentDetails.validateApiResponse = this.validateApiResponse;
  }

  setQuestionsEventsControlsForValidate(dependent: DependentDetails) {
    let valid = true;
    const invalidEvents = [];
    this.questions.forEach((eachQn, index) => {
      //Change here if event from api to be send while validating
      if (this.questionsForm.at(index)) {
        dependent[eachQn.key] = this.questionsForm.at(index)?.get(eachQn.key)?.value;
        eachQn.value = this.questionsForm.at(index)?.get(eachQn.key)?.value;
        if (
          this.questionsForm.at(index)?.get('eventControls') &&
          (eachQn.key === EventsConstants.eventsOnlyText() || eachQn.addEventForAnswer === eachQn.value)
        ) {
          if (dependent.events === null || dependent.events === undefined) dependent.events = [];
          if (this.requestDateChangedByValidator && dependent.showMandatoryDetails) {
            dependent.events = this.questionsForm.at(index).get('eventControls')?.value;
          } else {
            dependent.events = dependent.events.concat(this.questionsForm.at(index).get('eventControls')?.value);
          }
          dependent.events = setManualEventFlag(eachQn, dependent.events);
        }
        eachQn.eventValidationErrorResponse = [];
        if (
          eachQn.showAddeventButton &&
          eachQn.eventsCanbeAdded &&
          eachQn.addEventForAnswer === dependent[eachQn.key] &&
          !this.questionsForm.at(index).get('eventControls')?.value
        ) {
          if (eachQn.getEventInfoMessage() || eachQn.geteventInfoDep()) {
            eachQn.infoMessageWarningType = AlertTypeEnum.DANGER;
          } else {
            eachQn.eventValidationErrorResponse.push(new EventValidated(EventsConstants.NO_EVENTS_ADDED, false));
          }
          valid = false;
        } else if (
          eachQn.mandatoryEventsToBeAdded &&
          eachQn.mandatoryEventsToBeAdded.length &&
          eachQn.addEventForAnswer === dependent[eachQn.key]
        ) {
          const mandatorEventAdded = getMandatoryEventsAdded(eachQn.mandatoryEventsToBeAdded, dependent.events);
          if (!mandatorEventAdded.length) {
            valid = false;
            eachQn.eventValidationErrorResponse.push(
              new EventValidated(EventsConstants.NO_MARRIAGE_EVENTS_ADDED, false)
            );
          }
        }
        // }
      }
      if (eachQn.inputControls && eachQn.inputControls.length) {
        eachQn.inputControls.forEach((control, controlIndex) => {
          if (control.controlType === InputControlType.DROPDOWN) {
            //Dropdown value selected would be bilingual text we need the code
            dependent[control.key] = this.questionsForm
              .at(index)
              ?.get('inputControls')
              ['controls'].at(controlIndex)
              .get(control.key)
              .get(control.key + 'value')?.value?.code;
          } else {
            dependent[control.key] = this.questionsForm
              .at(index)
              ?.get('inputControls')
              ['controls'].at(controlIndex)
              .get(control.key).value;
          }
        });
      }
      if (!valid) {
        invalidEvents.push(valid);
      }
    });
    if (invalidEvents.length) {
      return false;
    } else {
      return true;
    }
    // return valid;
  }

  /*
   * This method is for cancel action
   */
  cancel() {
    Object.assign(this.dependentDetails, this.dependentDetailsBeforeValidation);
    this.resetSearch();
    this.cancelEdit.emit();
  }

  isAgeInNewLaw(age: number) {
    return this.ageInNewLaw?.filter(obj => (obj.year === age ? true : false))[0]?.inNewLaw;
  }

  setEventsInFormAndQnObject(
    dependentDetails: DependentDetails,
    questionsForm: FormArray,
    index: number,
    eachQn: Question
  ) {
    if (dependentDetails.events && dependentDetails.events.length) {
      const qnControl = questionsForm.at(index) as FormGroup;
      const eventControls = qnControl.get('eventControls') as FormArray;
      if (eventControls && eventControls.length) {
        dependentDetails.events.forEach((event: HeirEvent) => {
          const duplicateEvents = getDuplicateEvents(event, eventControls.value);
          if (
            !duplicateEvents.length &&
            (event.eventCategory === EventCategory[eachQn.key] || eachQn.key === EventsConstants.eventsOnlyText())
          ) {
            eventControls.push(new FormControl(event));
          }
        });
      } else {
        const eventsFormArray = getEventsFormArrayForKey(dependentDetails.events, eachQn.key);
        if (eventsFormArray.length) {
          qnControl.addControl('eventControls', eventsFormArray);
        }
      }
      eachQn.events = qnControl.get('eventControls')?.value || [];
    }
  }

  addMaritalEventToFormIndex(event: HeirEvent, questionsForm: FormArray, index: number, eachQn: Question) {
    const qnControl = questionsForm.at(index) as FormGroup;
    const eventControls = qnControl.get('eventControls') as FormArray;
    if (eventControls && eventControls.length) {
      // events.forEach((event: HeirEvent) => {
      const duplicateEvents = getDuplicateEvents(event, eventControls.value);
      if (!duplicateEvents.length && event.eventCategory === EventCategory.married) {
        eventControls.push(new FormControl(event));
      }
      // });
    } else {
      // const eventsFormArray = getEventsFormArrayForKey(events, eachQn.key);
      // if (eventsFormArray.length) {
      qnControl.addControl('eventControls', getEventsFormArrayForKey([event], QuestionTypes.MARRIED));
      // }
    }
    eachQn.events = qnControl.get('eventControls')?.value;
  }

  getLatestEvent(): HeirEvent {
    if (this.isValidator && !this.isDraft) {
      // If request date changed all saved events will be reset
      return getMaritalEventToPopulate(
        this.requestDateChangedByValidator && this.dependentDetails.showMandatoryDetails
          ? [...this.events.maritalEvents]
          : [...(this.dependentDetails?.events ? this.dependentDetails.events : []), ...this.events.maritalEvents],
        this.isPension
      );
    } else if (!this.isValidator || this.isDraft) {
      // NIC/MOJ dependents may be having events in eligibilityList
      if (this.dependentDetails.eligibilityList?.length) {
        getEventsForCategory(this.dependentDetails.eligibilityList, EventCategory.employed).forEach(event => {
          if (!getDuplicateEvents(event, this.events.employmentEvents).length) {
            this.events.employmentEvents.push(event);
          }
        });
        getEventsForCategory(this.dependentDetails.eligibilityList, EventCategory.married).forEach(event => {
          if (!getDuplicateEvents(event, this.events.maritalEvents).length) {
            this.events.maritalEvents.push(event);
          }
        });
      }
      return getMaritalEventToPopulate([...this.events.maritalEvents], this.isPension);
    } else {
      return null;
    }
  }

  setMaritalStatus(maritalStatusChanged = false) {
    if (
      !maritalStatusChanged &&
      this.selectedRelationship &&
      isFemale(this.selectedRelationship) &&
      !isMotherOrGrandMother(this.selectedRelationship)
    ) {
      this.setMaritalFormControls()
    } else if (!maritalStatusChanged) {
      this.dependentForm.removeControl('maritalStatus');
      this.dependentForm.removeControl('maritalStatusDate');
    }
    this.setStatusAndDate();
  }

  setMaritalStatusForPensionReform(maritalStatusChanged = false) {
    if (
      !maritalStatusChanged &&
      this.selectedRelationship &&
      isWifeHusband(this.selectedRelationship) &&
      !isMotherOrGrandMother(this.selectedRelationship)
    ) {
      this.setMaritalFormControls()
    } else if (!maritalStatusChanged) {
      this.dependentForm.removeControl('maritalStatus');
      this.dependentForm.removeControl('maritalStatusDate');
    }
    this.setStatusAndDate();
  }

  setStatusAndDate() {
    this.statusDate =
      this.dependentForm.getRawValue().maritalStatusDate && this.dependentForm.getRawValue().maritalStatusDate.gregorian
        ? moment(this.dependentForm.getRawValue().maritalStatusDate.gregorian)
        : null;
    this.status =
      this.dependentForm.getRawValue().maritalStatus && this.dependentForm.getRawValue().maritalStatus.english
        ? this.dependentForm.getRawValue().maritalStatus
        : null;
  }

  setMaritalFormControls() {
    this.makeFieldRequired('maritalStatus');
    // this.events gets modified from below fun call
    this.latestEvent = this.getLatestEvent();
    if (this.latestEvent) {
      this.latestEvent.status = new EventTypeToMaritalStatus().getStatus(
        this.latestEvent.eventType,
        this.maritalStatusList
      );
      this.dependentForm.get('maritalStatus').patchValue(this.latestEvent.status);
      this.setMaritalStatusDate(
        this.latestEvent.status?.english,
        this.latestEvent.eventStartDate,
        this.latestEvent.eventSource?.english === EventsConstants.EVENT_MOJ.english ||
        this.latestEvent.eventSource?.english === EventsConstants.EVENT_NIC.english
      );
      setTimeout(() => {
        this.latestEvent.eventSource?.english === EventsConstants.EVENT_MOJ.english ||
        this.latestEvent.eventSource?.english === EventsConstants.EVENT_NIC.english
          ? this.dependentForm.get('maritalStatus').disable()
          : this.dependentForm.get('maritalStatus').enable();
      }, 1);
    } else if (!this.requestDateChangedByValidator && this.dependentDetails.maritalStatus) {
      this.dependentForm.get('maritalStatus').patchValue(this.dependentDetails.maritalStatus);
      this.setMaritalStatusDate(
        this.dependentDetails.maritalStatus?.english,
        this.dependentDetails.maritalStatusDate,
        false
      );
    }
  }

  getForm() {
    if (this.personDetailsForm) {
      return this.personDetailsForm;
    } else {
      return this.fb.group({
        name: this.fb.group({
          arabic: this.fb.group(
            {
              firstName: [
                '',
                {
                  validators: [Validators.required, Validators.minLength(2), Validators.pattern('^([ء-ي]+[\\s]?)+$')]
                }
              ],
              secondName: ['', {validators: [Validators.pattern('^([ء-ي]+[\\s]?)+$')]}],
              thirdName: ['', {validators: [Validators.pattern('^([ء-ي]+[\\s]?)+$')]}],
              familyName: [
                '',
                {
                  validators: [Validators.required, Validators.minLength(2), Validators.pattern('^([ء-ي]+[\\s]?)+$')]
                }
              ]
            },
            {updateOn: 'blur'}
          ),
          english: this.fb.group({
            name: [
              null,
              {
                validators: [Validators.minLength(2), Validators.pattern('^[a-zA-Z ]+$')],
                updateOn: 'blur'
              }
            ]
          })
        }),
        gender: this.fb.group({
          english: ['Male', {validators: Validators.required, updateOn: 'blur'}],
          arabic: null
        })
      });
    }
  }

  getLabel() {
    if (this.searchPersonData?.identity || this.dependentDetails?.identity) {
      const idObj: CommonIdentity | null =
        this.searchPersonData?.identity?.length || this.dependentDetails?.identity?.length
          ? getIdRemoveNullValue(this.searchPersonData?.identity || this.dependentDetails?.identity)
          : null;
      if (idObj) {
        this.idValue = idObj.id.toString();
        this.idLabel = getIdLabel(idObj);
      }
    }
  }

  getAuthPerson(personId: string) {
    this.getAuthPersonForId.emit(personId);
  }

  getGuardian(personId: string) {
    this.getGuardianForId.emit(personId);
  }

  setEventForMarried(question: Question, eachQuestionGrp: FormGroup) {
    if (
      [QuestionTypes.MARRIED, QuestionTypes.DIVORCED_OR_WIDOWED, QuestionTypes.MARRIED_WIFE].includes(
        question.key as QuestionTypes
      ) &&
      question.eventsCanbeAdded
    ) {
      const maritalStatus = this.status;
      const maritalStatusDate = {gregorian: this.statusDate.toDate()};
      const marriageEvent = getEventsForMaritalStatus(
        maritalStatus.english,
        maritalStatusDate,
        this.eligibilityStartDateInDateFormat
      );
      if (eachQuestionGrp?.get(question.key)?.value === question.addEventForAnswer) {
        if (this.events?.maritalEvents) {
          this.events?.maritalEvents.forEach(event => {
            if (!getDuplicateEvents(event, question.events).length) question.events.push(event);
          });
          // question.events = question.events.length ? [...question.events, ...this.events?.maritalEvents] : [...this.events?.maritalEvents];
        }
        setMariatalEvent(question, marriageEvent, this.questions);
        //Delete events from event only key
        deleteNonRemovableEvent(this.questions, marriageEvent);
        // question.events.forEach(events => events.manualEvent = true);
      } else {
        const index = this.questions.findIndex(qn => qn.key === EventsConstants.eventsOnlyText());
        if (index >= 0) {
          if (this.events?.maritalEvents) {
            this.events?.maritalEvents.forEach(event => {
              if (!getDuplicateEvents(event, this.questions[index].events).length)
                this.questions[index]?.events?.push(event);
            });
            // this.questions[index].events = this.questions[index].events.length ? [...this.questions[index].events, ...this.events?.maritalEvents] : [...this.events?.maritalEvents];
          }
          question.events.forEach(event => {
            if (!getDuplicateEvents(event, this.questions[index].events).length)
              this.questions[index]?.events?.push(event);
          });
          if (marriageEvent) {
            const duplicateEvents = getDuplicateEvents(marriageEvent, this.questions[index].events);
            if (!duplicateEvents.length) this.questions[index]?.events?.push(marriageEvent);
          }
        }
      }
    }
  }
}
