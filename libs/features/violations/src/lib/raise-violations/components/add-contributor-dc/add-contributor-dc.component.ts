import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  addDays,
  addMonths,
  AlertService,
  BorderNumber,
  CalendarService,
  convertToStringDDMMYYYY,
  Establishment,
  greaterThanValidator,
  hijiriToJSON,
  Iqama,
  jsonToHijiri,
  LanguageToken,
  LovList,
  NationalId,
  NIN,
  parseToHijiri,
  Passport,
  startOfDay,
  subtractMonths
} from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  getDateFormat,
  getDateFormatFromCalendar,
  RaiseContributorDetails,
  RaiseEngagementDetails,
  RaiseViolationContributor,
  RecordActionEnum,
  ViolationConstants,
  ViolationsEnum,
  ViolationTypeEnum
} from '../../../shared';
import { ViolationContributorEnum } from '../../../shared/enums/violation-contributor';
import { ContributorSummary } from '../../../shared/models/contributor-summary';
import { EngagementInfo, Engagements } from '../../../shared/models/engagement-info';
import { RaiseWrongBenefits } from '../../../shared/models/raise-wrong-benefits';
import { EngagementDetailsDcComponent } from '../engagement-details-dc/engagement-details-dc.component';
import { InputDateDcComponent } from '@gosi-ui/foundation-theme/lib/components/widgets';
import { distinctUntilChanged, timestamp } from 'rxjs/operators';

@Component({
  selector: 'vol-add-contributor-dc',
  templateUrl: './add-contributor-dc.component.html',
  styleUrls: ['./add-contributor-dc.component.scss']
})
export class AddContributorDcComponent implements OnInit, OnChanges {
  accordionPanel = -1;
  lang: String = 'en';
  identifierForm: FormGroup;
  engagementLive = ViolationContributorEnum.LIVE;
  engagementTerminated = ViolationContributorEnum.HISTORY;
  engagementCancelled = ViolationContributorEnum.CANCELLED;

  @Input() violationYesOrNoList: Observable<LovList>;
  @Input() wrongBenefitsType: LovList;
  @Input() isVerified: boolean;
  @Input() engagementsInfo: EngagementInfo;
  @Input() contributorSummaryDetails: ContributorSummary = new ContributorSummary();
  @Input() raiseViolationData: RaiseViolationContributor = new RaiseViolationContributor();
  @Input() violationType: string = undefined;
  @Input() isContributorEdit: boolean;
  @Input() id: string;
  @Input() removeNewlyAdedEng: boolean;
  @Input() establishmentDetails: Establishment;
  @Input() makeAddContributorRed: boolean;
  @Input() hasProactiveEng: boolean;

  @Output() verify: EventEmitter<number> = new EventEmitter();
  @Output() resetPerson: EventEmitter<null> = new EventEmitter();
  @Output() saveEngagement: EventEmitter<null> = new EventEmitter();
  @Output() saveContributor: EventEmitter<null> = new EventEmitter();
  @Output() cancelCurrentContributor: EventEmitter<null> = new EventEmitter();
  @Output() cancelCurrentContributorEdit: EventEmitter<number> = new EventEmitter();

  @ViewChild('engagementComponent', { static: false })
  engagementComponent: EngagementDetailsDcComponent;
  @ViewChildren('firstBenefitDate') firstBenefitDatesComponent: QueryList<InputDateDcComponent>;
  @ViewChildren('lastBenefitDate') lastBenefitDatesComponent: QueryList<InputDateDcComponent>;
  engagements: Engagements[];
  benefitsDetails: RaiseWrongBenefits[];
  checkBoxForm: FormControl = new FormControl(null);
  personIdentifier: number;
  addContributorForm: FormArray = new FormArray([]);
  addBenefitsForm: FormArray = new FormArray([]);
  selectedIndex: Array<number> = [];
  isCancelEng: boolean;
  isIncorrectWage: boolean;
  isAddNewEng: boolean;
  isIncorrectReason: boolean;
  isViolatingProvisions: boolean;
  currentDate: Date = new Date();
  maxStartDate: Date = new Date();
  maxEndDate: Date = new Date();
  // minEndDateGregorian: Date = new Date();
  // minEndDateHijiri:Date=new Date();
  startDate: any;
  endDate: any;
  isCancelDatesNotValid: boolean = false;
  benefitIndicator: boolean;
  isWrongBenefits: boolean;
  setCancelEngForm = false;
  hasEngagment: boolean;
  isWrongBenefitEng: boolean = false;
  isAllBenefitsFalse: boolean = false;
  isAnyTerminatedEng: boolean = false;
  isAnyActiveEng: boolean = false;
  isAnyCancelledEng;
  boolean = false;
  showEngAccordionError: Array<boolean> = [];
  benefitButtonClicked: boolean = false;
  isEmptyBenefitForm: boolean = false;
  lumpsumSet = new Set(ViolationConstants.BENEFIT_TYPE_LUMPSUM_LIST);
  firstBenefitMaxDate: Date;
  maxBenefitLastDate = [];
  /**
   * @param language
   */
  constructor(
    readonly fb: FormBuilder,
    readonly alertService: AlertService,
    readonly calendarService: CalendarService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<String>
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.identifierForm = this.fb.group({
      identifier: [null, { validators: Validators.required }]
    });
    this.firstBenefitMaxDate = subtractMonths(new Date(), 1);
    this.checkBenefitFormArray();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.wrongBenefitsType && changes.wrongBenefitsType.currentValue){
      this.wrongBenefitsType=changes.wrongBenefitsType.currentValue;
      this.wrongBenefitsType.items=this.wrongBenefitsType.items.filter(benefit => benefit?.value?.english.toUpperCase() !== ViolationsEnum?.BENEFIT_TYPE_ALL.toUpperCase());
    }
    if (changes.contributorSummaryDetails && changes.contributorSummaryDetails.currentValue) {
      this.contributorSummaryDetails = changes.contributorSummaryDetails.currentValue;
    }
    if (changes.engagementsInfo && changes.engagementsInfo.currentValue) {
      this.engagementsInfo = changes.engagementsInfo.currentValue;
      this.addContributorForm = new FormArray([]);
      this.createForm(this.engagementsInfo?.engagements);
    }
    if (changes.violationType && changes.violationType.currentValue) {
      this.violationType = changes.violationType.currentValue;
      this.checkForViolationType(this.violationType);
    }
    if (changes.removeNewlyAdedEng && changes.removeNewlyAdedEng.currentValue) {
      this.removeNewlyAdedEng = changes.removeNewlyAdedEng.currentValue;
      this.selectCheckboxForAlreadyAdded();
      if (this.isWrongBenefits) this.resetBenefitForm();
    }
    if (this.isContributorEdit && this.contributorSummaryDetails && this.engagementsInfo) {
      this.addContributorForm = new FormArray([]);
      this.addBenefitsForm = new FormArray([]);
      this.createForm(this.engagementsInfo?.engagements);
      // make everything as a new method
      this.selectCheckboxForAlreadyAdded();
    }
    if (changes.makeAddContributorRed) {
      this.makeAddContributorRed = changes.makeAddContributorRed.currentValue;
    }
    this.checkForEngagements();
    this.checkBenefitFormArray();
  }
  onFirstBenefitDateChange(index: number) {
    if (this.addBenefitsForm.controls[index]?.get('firstBenefitDate').touched) {
      //  setting the min date for last benefit date
      let lastBenefitDateComponent = this.lastBenefitDatesComponent.toArray()[index];
      lastBenefitDateComponent.minDate = addDays(
        this.addBenefitsForm.controls[index]?.get('firstBenefitDate')?.get('gregorian').value,
        1
      );
      if (
        this.addBenefitsForm.controls[index]?.get('lastBenefitDate')?.get('gregorian').value &&
        this.addBenefitsForm.controls[index]?.get('lastBenefitDate').touched
      ) {
        this.addBenefitsForm.controls[index]?.get('lastBenefitDate')?.get('gregorian').setValue(null);
        this.addBenefitsForm.controls[index]?.get('lastBenefitDate')?.get('gregorian').markAsTouched();
      }
      this.handleLumpsumBenefitValidation(index);
    }
  }
  handleLumpsumBenefitValidation(index: number) {
    let benefitType = this.addBenefitsForm.controls[index]?.get('benefitType')?.get('english').value;
    let modifiedBenefitType=benefitType.replace(/'/g,'');
    let isLumpsum = this.lumpsumSet.has(modifiedBenefitType);
    if (isLumpsum) {
      this.maxBenefitLastDate[index] = addMonths(
        this.addBenefitsForm.controls[index]?.get('firstBenefitDate')?.get('gregorian').value,
        1
      );
    } else {
      this.maxBenefitLastDate[index] = new Date();
    }
  }
  checkBenefitFormArray() {
    this.addBenefitsForm.valueChanges.subscribe(benefitForm => {
      if (benefitForm.length === 0) {
        this.isEmptyBenefitForm = true;
      } else {
        this.isEmptyBenefitForm = false;
      }
    });
  }
  getPeriodStartDate(data: { date: AbstractControl; type: string }) {
    this.startDate =
      data.type === ViolationsEnum.DATE_GREGORIAN
        ? data.date?.get('gregorian')?.value
        : this.getGregorianDate(data.date?.get('hijiri')?.value);
  }
  getPeriodEndDate(data: { date: AbstractControl; type: string }) {
    this.endDate =
      data.type === ViolationsEnum.DATE_GREGORIAN
        ? data.date?.get('gregorian')?.value
        : this.getGregorianDate(data.date?.get('hijiri')?.value);
  }
  checkForEngagements() {
    if (this.engagementsInfo?.engagements?.length > 0) {
      this.engagementsInfo?.engagements.forEach(engagement => {
        if (engagement?.benefitIndicator === true) {
          this.isWrongBenefitEng = true;
        } else if (engagement?.benefitIndicator === false) {
          this.isAllBenefitsFalse = true;
        }
        switch (engagement?.status) {
          case this.engagementLive:
            this.isAnyActiveEng = true;
            break;
          case this.engagementTerminated:
            this.isAnyTerminatedEng = true;
            break;
          case this.engagementCancelled:
            this.isAnyCancelledEng = true;
            break;
        }
      });
    }
  }
  resetBenefitForm() {
    this.raiseViolationData?.contributorDetails.forEach(contributor => {
      if (contributor.benefitsDetails.length === 0) {
        this.addBenefitsForm.clear();
      }
    });
  }
  selectCheckboxForAlreadyAdded() {
    this.selectedIndex = [];
    this.addContributorForm?.controls.forEach(item => {
      item.get('selectEng').setValue(false);
    });
    this.engagementsInfo?.engagements?.forEach((eng, i) => {
      eng.isSelected = false;
      if (this.checkIfEngAdded(eng)) {
        this.addContributorForm.controls[i].get('selectEng').setValue(true);
        this.selectedIndex.push(i);
        this.engagementsInfo.engagements[i].isSelected = true;
        this.engagementsInfo.engagements[i].alreadyAdded = true;
        if (this.isIncorrectWage || this.isViolatingProvisions || this.isWrongBenefits) {
          this.addEngToContributor(i);
        }
        if (!this.isCancelEng) this.bindDataToForm(i);
      }
    });
    if (this.isWrongBenefits) this.bindDataToBenefitsForm();
  }
  checkIfEngAdded(engagement: Engagements) {
    const contIndex = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
    let isAdded = false;
    this.raiseViolationData?.contributorDetails[contIndex]?.engagementDetails?.forEach(eng => {
      if (eng?.engagementId === engagement?.engagementId) isAdded = true;
    });
    return isAdded;
  }
  checkForViolationType(type: string) {
    this.isCancelEng = false;
    this.isIncorrectWage = false;
    this.isAddNewEng = false;
    this.isIncorrectReason = false;
    this.isViolatingProvisions = false;
    this.isWrongBenefits = false;
    switch (type.toUpperCase()) {
      case ViolationTypeEnum.RAISE_CANCEL_ENGAGEMENT.toUpperCase(): {
        this.isCancelEng = true;
        break;
      }
      case ViolationTypeEnum.RAISE_ADD_NEW_ENGAGEMENT.toUpperCase(): {
        this.isAddNewEng = true;
        break;
      }
      case ViolationTypeEnum.RAISE_INCORRECT_REASON.toUpperCase(): {
        this.isIncorrectReason = true;
        break;
      }
      case ViolationTypeEnum.RAISE_INCORRECT_WAGE.toUpperCase(): {
        this.isIncorrectWage = true;
        break;
      }
      case ViolationTypeEnum.RAISE_VIOLATING_PROVISIONS.toUpperCase(): {
        this.isViolatingProvisions = true;
        break;
      }
      case ViolationTypeEnum.RAISE_WRONG_BENEFITS.toUpperCase(): {
        this.isWrongBenefits = true;
        break;
      }
    }
  }
  createForm(engagement: Engagements[]) {
    engagement?.forEach(eng => {
      this.addContributorForm.push(this.createEngForm(eng));
    });
  }

  /**
   * Method to create exclusion form
   */
  createEngForm(eng: Engagements) {
    return this.fb.group({
      selectEng: [''],
      engagement: this.createEngagementForm(eng),
      id: eng?.engagementId
    });
  }
  createEngagementForm(eng: Engagements): FormGroup {
    return this.fb.group({
      isEngagementCancelled: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      isEngAddedBackdated: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      isWageCorrected: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      isReasonIncorrected: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      calendarType: ['Gregorian', { validators: Validators.required }],
      periodStartDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        entryFormat: ''
      }),
      periodEndDate: this.fb.group({
        gregorian: [null, { validators: Validators.required }],
        hijiri: [null],
        entryFormat: ''
      }),
      contributionAmount: [null, { validators: Validators.compose([greaterThanValidator(0), Validators.required]) }]
    });
  }
  // wrongBenefits section
  addNewBenfitsRow() {
    this.benefitButtonClicked = true;
    if (this.addBenefitsForm.length > 0) this.addBenefitsForm.markAllAsTouched();
    this.addBenefitsForm.push(this.createBenefitsForm());
  }
  createBenefitsForm() {
    return this.fb.group({
      benefitType: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      benefitAmount: [null, { validators: Validators.compose([greaterThanValidator(0), Validators.required]) }],
      // benefitDuration: [null, { validators: Validators.compose([Validators.required]) }],
      firstBenefitDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijiri: [null]
      }),
      lastBenefitDate: this.fb.group({
        gregorian: [
          null,
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijiri: [null]
      })
    });
  }

  deleteAddedBenefit(index: any) {
    this.addBenefitsForm.removeAt(index);
  }

  // method for verifying nin
  verifyId() {
    const identifier = this.identifierForm.get('identifier');
    identifier.markAllAsTouched();
    if (identifier.valid && identifier.value > 0) {
      this.personIdentifier = this.identifierForm.get('identifier').value;
      this.verify.emit(this.identifierForm.get('identifier').value);
    }
  }
  resetId() {
    this.identifierForm.get('identifier').reset();
    this.identifierForm.get('identifier').setValidators(Validators.required);
    if (this.raiseViolationData?.contributorDetails?.length > 0) {
      const index = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
      if (index >= 0 && !this.isIncorrectWage && !this.isWrongBenefits && !this.isViolatingProvisions) {
        if (this.raiseViolationData?.contributorDetails[index]?.engagementDetails.length > 0) {
          this.raiseViolationData.contributorDetails[index].recordAction = RecordActionEnum.REMOVE;
        } else {
          this.alertService.clearAlerts();
          this.raiseViolationData.contributorDetails[index].recordAction = RecordActionEnum.NO_ACTION;
          this.raiseViolationData?.contributorDetails.splice(index, 1);
        }
      } else if ((this.isIncorrectWage || this.isWrongBenefits || this.isViolatingProvisions) && index >= 0) {
        if (this.raiseViolationData?.contributorDetails[index]?.engagementDetails.length > 0) {
          this.raiseViolationData?.contributorDetails.splice(index, 1);
        } else {
          this.alertService.clearAlerts();
          this.raiseViolationData.contributorDetails[index].recordAction = RecordActionEnum.NO_ACTION;
          this.raiseViolationData?.contributorDetails.splice(index, 1);
        }
      }
    }
    this.accordionPanel = -1;
    this.resetPerson.emit();
    this.benefitButtonClicked = false;
  }
  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  isSinNeeded(identity: Array<NIN | Iqama | NationalId | Passport | BorderNumber>) {
    const types = ['NIN', 'IQAMA', 'GCCID'];
    let issin = false;
    if (identity.length > 0) {
      for (const item of identity) {
        issin = types.includes(item.idType);
        if (issin === true) break;
      }
      if (issin) return 1;
      else return 0;
    } else return 0;
  }
  /**
   * Method to open the owner accordion
   * @param openEvent
   * @param tabIndex
   */
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
  checkIfEligilbleForEdit(tabIndex): boolean {
    let eligible = false;
    this.selectedIndex.forEach(element => {
      if (tabIndex === element) eligible = true;
    });
    return eligible;
  }
  selectEngagement(index) {
    if (this.addContributorForm.controls[index].get('selectEng').value === true) {
      this.selectedIndex.push(index);
      if (!(this.isIncorrectWage || this.isViolatingProvisions || this.isWrongBenefits)) {
        this.accordionPanel = index + 1;
      }
      this.engagementsInfo.engagements[index].isSelected = true;
      if (this.isIncorrectWage || this.isViolatingProvisions || this.isWrongBenefits) {
        this.addEngToContributor(index);
      }
    } else {
      let tabIndex = -1;
      this.selectedIndex.forEach((tab, i) => {
        if (index === tab) tabIndex = i;
      });
      if (tabIndex < this.selectedIndex?.length && tabIndex >= 0) this.selectedIndex.splice(tabIndex, 1);
      this.engagementsInfo.engagements[index].isSelected = false;
      this.accordionPanel = -1;
      const contributorIndex = this.checkforContributorAdded();
      const engIndex = this.checkForEngIndex(contributorIndex, index);
      if (engIndex >= 0 && (!this.isIncorrectWage || !this.isViolatingProvisions || !this.isWrongBenefits)) {
        this.raiseViolationData.contributorDetails[contributorIndex].engagementDetails[engIndex].recordActionType =
          RecordActionEnum.REMOVE;
      }
    }
  }
  addEngToContributor(index) {
    const contributorIndex = this.checkforContributorAdded();
    const form = this.addContributorForm?.controls[index];
    form?.get('engagement')?.markAllAsTouched();
    const engIndex = this.checkForEngIndex(contributorIndex, index);
    engIndex >= 0
      ? (this.raiseViolationData.contributorDetails[contributorIndex].engagementDetails[engIndex] = this.setEngValue(
          form,
          index,
          true
        ))
      : this.raiseViolationData.contributorDetails[contributorIndex].engagementDetails.push(
          this.setEngValue(form, index, false)
        );
    // this.saveEngagement.emit();
  }
  addContributor() {
    //const valid= !this.isWrongBenefits ? true:this.checkForBenefits();
    const contributorIndex = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
    const valid = !this.isWrongBenefits ? true : this.checkForBenefits();
    if (
      this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails?.length > 0 &&
      !this.notAllEngagementsRemoved(contributorIndex) &&
      valid
    ) {
      if (this.checkForAllEngAdded(contributorIndex) && this.allEngSaved(contributorIndex)) {
        this.raiseViolationData.contributorDetails[contributorIndex].benefitsDetails = [];
        this.raiseViolationData.contributorDetails[contributorIndex].benefitsDetails = this.benefitsDetails;

        if (
          this.raiseViolationData?.contributorDetails[contributorIndex]?.benefitsDetails?.length === 0 &&
          this.isWrongBenefits
        ) {
          this.alertService.clearAlerts();
          this.alertService.showErrorByKey('VIOLATIONS.PLEASE-ADD-BENEFIT-DETAILS');
        } else {
          this.saveContributor.emit();
        }
      } else {
        this.alertService.clearAlerts();
        this.alertService.showErrorByKey('VIOLATIONS.ADD-ALL-SELECTED-ENG');
      }
    } else {
      if (valid) {
        this.alertService.clearAlerts();
        if (
          this.isIncorrectWage ||
          this.isViolatingProvisions ||
          this.isWrongBenefits ||
          (this.notAllEngagementsRemoved(contributorIndex) &&
            this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails?.length > 0)
        ) {
          this.alertService.showErrorByKey('VIOLATIONS.ADD-ATLEAST-ONE-ENGAGEMENT');
        } else {
          this.alertService.showErrorByKey('VIOLATIONS.ADD-ALL-SELECTED-ENG');
        }
      } else {
        if (
          this.isWrongBenefits &&
          this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails?.length > 0
        ) {
          this.alertService.clearAlerts();
          this.alertService.showErrorByKey('VIOLATIONS.PLEASE-ADD-BENEFIT-DETAILS');
        } else {
          this.alertService.clearAlerts();
          this.alertService.showErrorByKey('VIOLATIONS.ADD-ATLEAST-ONE-ENGAGEMENT');
        }
      }
    }
  }
  allEngSaved(contributorIndex: number) {
    let allSaved = true;
    this.engagementsInfo?.engagements?.forEach((eng, i) => {
      if (eng?.alreadyAdded) {
        const formIndex = this.addContributorForm.controls.findIndex(
          element => element?.get('id').value === eng?.engagementId
        );

        const dataIndex = this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails?.findIndex(
          data => eng?.engagementId === data?.engagementId
        );
        if (
          this.checkValueChanged(
            this.addContributorForm.controls[formIndex].get('engagement'),
            this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails[dataIndex]
          )
        ) {
          allSaved = false;
          this.showEngAccordionError[i] = true;
        }
      }
    });
    return allSaved;
  }
  checkValueChanged(form: AbstractControl, engData: RaiseEngagementDetails) {
    if (
      form?.get('isWageCorrected').get('english').value !==
      (engData?.isWageCorrected === true
        ? ViolationsEnum.BOOLEAN_YES
        : engData?.isWageCorrected === false
        ? ViolationsEnum.BOOLEAN_NO
        : null)
    )
      return true;
    if (
      form?.get('isEngAddedBackdated').get('english').value !==
      (engData?.isEngagementBackdated === true
        ? ViolationsEnum.BOOLEAN_YES
        : engData?.isEngagementBackdated === false
        ? ViolationsEnum.BOOLEAN_NO
        : null)
    )
      return true;
    if (
      form?.get('isReasonIncorrected').get('english').value !==
      (engData?.isBenefitEffected === true
        ? ViolationsEnum.BOOLEAN_YES
        : engData?.isBenefitEffected === false
        ? ViolationsEnum.BOOLEAN_NO
        : null)
    )
      return true;
    if (
      form?.get('isEngagementCancelled').get('english').value !==
      (engData?.isFullyCancelled === true
        ? ViolationsEnum.BOOLEAN_YES
        : engData?.isFullyCancelled === false
        ? ViolationsEnum.BOOLEAN_NO
        : null)
    )
      return true;
    if (!engData?.isFullyCancelled) {
      if (form?.get('calendarType').value === ViolationsEnum.DATE_GREGORIAN) {
        if (
          convertToStringDDMMYYYY(startOfDay(form?.get('periodStartDate')?.get('gregorian')?.value)?.toString()) !==
          (engData?.cancelledPeriodStartDate?.gregorian
            ? convertToStringDDMMYYYY(startOfDay(engData?.cancelledPeriodStartDate?.gregorian).toString())
            : null)
        )
          return true;

        if (
          convertToStringDDMMYYYY(startOfDay(form?.get('periodEndDate')?.get('gregorian')?.value)?.toString()) !==
          (engData?.cancelledPeriodEndDate?.gregorian
            ? convertToStringDDMMYYYY(startOfDay(engData?.cancelledPeriodEndDate?.gregorian)?.toString())
            : null)
        )
          return true;
      } else {
        if (
          jsonToHijiri(form?.get('periodStartDate').get('hijiri').value) !==
          (engData?.cancelledPeriodStartDate?.hijiri ? parseToHijiri(engData?.cancelledPeriodStartDate?.hijiri) : null)
        )
          return true;
        if (
          jsonToHijiri(form?.get('periodEndDate').get('hijiri').value) !==
          (engData?.cancelledPeriodEndDate?.hijiri ? parseToHijiri(engData?.cancelledPeriodEndDate?.hijiri) : null)
        )
          return true;
      }
    }
    if (engData?.contributionAmount !== form?.get('contributionAmount').value) return true;
    return false;
  }

  checkForBenefits(): Boolean {
    this.addBenefitsForm.markAllAsTouched();
    if (this.addBenefitsForm.length < 0) {
      return false;
    } else {
      let isValid = true;
      this.addBenefitsForm?.controls.forEach(item => {
        if (item.invalid) {
          isValid = false;
        }
      });
      if (isValid) {
        this.getBenefitValues();
      }
      return isValid;
    }
  }
  getBenefitValues() {
    this.benefitsDetails = [];
    this.addBenefitsForm?.controls.forEach((item, i) => {
      this.benefitsDetails.push({
        benefitType: item?.get('benefitType')?.value,
        benefitAmount: item?.get('benefitAmount').value,
        firstPaymentDate: item?.get('firstBenefitDate').value,
        lastBenefitsDuration: item?.get('lastBenefitDate').value,
        recordActionType: RecordActionEnum.ADD
      });
    });
  }

  // method to check all engagements are removed
  notAllEngagementsRemoved(contributorIndex) {
    let allEngagementsRemoved = true;
    this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails.forEach(eng => {
      if (eng.recordActionType !== RecordActionEnum.REMOVE) allEngagementsRemoved = false;
    });
    return allEngagementsRemoved;
  }
  checkForAllEngAdded(contributorIndex) {
    let userAdded = true;
    this.engagementsInfo?.engagements.forEach(engagement => {
      if (
        engagement?.isSelected === true &&
        this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails.find(
          eng => eng?.engagementId === engagement?.engagementId
        ) === undefined
      )
        userAdded = false;
    });
    return userAdded;
  }
  cancelContributor() {
    this.identifierForm.get('identifier').reset();
    this.identifierForm.get('identifier').setValidators(Validators.required);
    if (this.raiseViolationData?.contributorDetails?.length > 0) {
      const index = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
      if (index >= 0) this.raiseViolationData.contributorDetails[index].recordAction = RecordActionEnum.REMOVE;
    }
    this.cancelCurrentContributor.emit();
  }
  cancelContributorForEdit() {
    this.cancelCurrentContributorEdit.emit(this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo));
  }
  saveEng(index: number) {
    const contributorIndex = this.checkforContributorAdded();
    const form = this.addContributorForm?.controls[index];
    form.get('engagement').markAllAsTouched();
    if (this.checkFormValidity(form)) {
      const engIndex = this.checkForEngIndex(contributorIndex, index);
      engIndex >= 0
        ? (this.raiseViolationData.contributorDetails[contributorIndex].engagementDetails[engIndex] = this.setEngValue(
            form,
            index,
            true
          ))
        : this.raiseViolationData.contributorDetails[contributorIndex].engagementDetails.push(
            this.setEngValue(form, index, false)
          );
      this.saveEngagement.emit();
      this.accordionPanel = -1;
      this.showEngAccordionError[index] = false;
    } else {
      if (this.isCancelEng && this.isCancelDatesNotValid) {
        this.alertService.showErrorByKey('VIOLATIONS.CANCEL-ENG-DATES-INVALID');
      } else {
        this.alertService.showMandatoryErrorMessage();
      }
      this.showEngAccordionError[index] = true;
    }
  }
  saveEngEdit(index: number) {
    const contributorIndex = this.checkforContributorAdded();
    const form = this.addContributorForm?.controls[index];
    form.get('engagement').markAllAsTouched();
    if (this.checkFormValidity(form)) {
      const engIndex = this.checkForEngIndex(contributorIndex, index);
      engIndex >= 0
        ? (this.raiseViolationData.contributorDetails[contributorIndex].engagementDetails[engIndex] = this.setEngValue(
            form,
            index,
            true
          ))
        : this.raiseViolationData.contributorDetails[contributorIndex].engagementDetails.push(
            this.setEngValue(form, index, false)
          );
      this.accordionPanel = -1;
    } else this.alertService.showMandatoryErrorMessage();
  }
  cancelEng(index: number) {
    if (!this.engagementsInfo.engagements[index].alreadyAdded) {
      (this.addContributorForm.controls[index] as FormGroup).reset();
      this.engagementsInfo.engagements[index].isSelected = false;
    } else {
      this.bindDataToForm(index);
    }
    if (this.isCancelEng) this.setCancelEngForm = !this.setCancelEngForm;
    this.showEngAccordionError[index] = false;
    this.accordionPanel = -1;
  }
  cancelEngEdit(index: number) {
    if (this.engagementsInfo.engagements[index].alreadyAdded) this.bindDataToForm(index);
    else {
      (this.addContributorForm.controls[index] as FormGroup).reset();
      this.engagementsInfo.engagements[index].isSelected = false;
    }
    if (this.isCancelEng) this.setCancelEngForm = !this.setCancelEngForm;
    this.accordionPanel = -1;
  }
  bindDataToForm(index: number) {
    const contributorIndex = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
    const engIndex = this.checkForEngIndex(contributorIndex, index);
    const engData = this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails[engIndex];

    const form = this.addContributorForm?.controls[index];
    form
      .get('engagement')
      .get('isEngagementCancelled')
      .get('english')
      .setValue(
        engData?.isFullyCancelled === true
          ? ViolationsEnum.BOOLEAN_YES
          : engData?.isFullyCancelled === false
          ? ViolationsEnum.BOOLEAN_NO
          : null
      );
    form
      .get('engagement')
      .get('calendarType')
      .setValue(
        engData?.cancelledPeriodStartDate?.entryFormat
          ? getDateFormat(engData?.cancelledPeriodStartDate?.entryFormat)
          : getDateFormatFromCalendar(engData?.cancelledPeriodStartDate)
      );
    // form
    //   .get('engagement')
    //   .get('periodStartDate')
    //   .get('entryFormat')
    //   .setValue(
    //     engData?.cancelledPeriodStartDate?.entryFormat
    //       ? getDateFormat(engData?.cancelledPeriodStartDate?.entryFormat)
    //       : getDateFormatFromCalendar(engData?.cancelledPeriodStartDate)
    //   );
    form
      .get('engagement')
      .get('periodStartDate')
      .get('gregorian')
      .setValue(
        engData?.cancelledPeriodStartDate?.gregorian ? new Date(engData?.cancelledPeriodStartDate?.gregorian) : null
      );
    form
      .get('engagement')
      .get('periodStartDate')
      .get('hijiri')
      .setValue(
        engData?.cancelledPeriodStartDate?.hijiri
          ? convertToStringDDMMYYYY(engData?.cancelledPeriodStartDate?.hijiri)
          : null
      );
    form
      .get('engagement')
      .get('contributionAmount')
      .setValue(engData?.contributionAmount ? engData?.contributionAmount : null);
    // if (this.isCancelEng && this.isContributorEdit) this.engagementComponent?.checkForCancelledBooleanYesOrNo();
    if (this.isCancelEng) this.setCancelEngForm = !this.setCancelEngForm;
    form
      .get('engagement')
      .get('isEngAddedBackdated')
      .get('english')
      .setValue(
        engData?.isEngagementBackdated === true
          ? ViolationsEnum.BOOLEAN_YES
          : engData?.isEngagementBackdated === false
          ? ViolationsEnum.BOOLEAN_NO
          : null
      );
    form
      .get('engagement')
      .get('isReasonIncorrected')
      .get('english')
      .setValue(
        engData?.isBenefitEffected === true
          ? ViolationsEnum.BOOLEAN_YES
          : engData?.isBenefitEffected === false
          ? ViolationsEnum.BOOLEAN_NO
          : null
      );
    setTimeout(() => {
      // form
      //   .get('engagement')
      //   .get('periodEndDate')
      //   .get('entryFormat')
      //   .setValue(
      //     engData?.cancelledPeriodEndDate?.entryFormat
      //       ? getDateFormat(engData?.cancelledPeriodEndDate?.entryFormat)
      //       : getDateFormatFromCalendar(engData?.cancelledPeriodEndDate)
      //   );
      form
        .get('engagement')
        .get('periodEndDate')
        .get('gregorian')
        .setValue(
          engData?.cancelledPeriodEndDate?.gregorian ? new Date(engData?.cancelledPeriodEndDate?.gregorian) : null
        );
      form
        .get('engagement')
        .get('periodEndDate')
        .get('hijiri')
        .setValue(
          engData?.cancelledPeriodEndDate?.hijiri
            ? convertToStringDDMMYYYY(engData?.cancelledPeriodEndDate?.hijiri)
            : null
        );
    }, 200);
  }
  checkForEngIndex(contributorIndex: number, engIndex: number): number {
    let index = -1;
    this.raiseViolationData?.contributorDetails[contributorIndex]?.engagementDetails.forEach((eng, i) => {
      if (eng?.engagementId === this.engagementsInfo?.engagements[engIndex]?.engagementId) index = i;
    });
    return index;
  }
  // wrong benefits form value
  bindDataToBenefitsForm() {
    const contributorIndex = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
    const wrongBenefitsDetails = this.raiseViolationData?.contributorDetails[contributorIndex]?.benefitsDetails;
    wrongBenefitsDetails?.forEach(item => {
      const benefitsForm = this.createBenefitsForm();
      benefitsForm.get('benefitType').setValue(item?.benefitType);
      benefitsForm.get('benefitAmount').setValue(item?.benefitAmount);
      benefitsForm?.get('firstBenefitDate').get('gregorian').setValue(new Date(item?.firstPaymentDate?.gregorian));
      benefitsForm.get('lastBenefitDate').get('gregorian').setValue(new Date(item?.lastBenefitsDuration?.gregorian));
      this.addBenefitsForm.push(benefitsForm);
    });
  }
  checkFormValidity(form: AbstractControl): boolean {
    let valid = false;
    if (this.isCancelEng) {
      valid =
        form.get('engagement').get('isEngagementCancelled').valid &&
        form.get('engagement').get('contributionAmount').valid;

      valid = this.cancelValid(form) && valid;
      // form.get('engagement')?.get('isEngagementCancelled')?.get('english').value === ViolationsEnum.BOOLEAN_YES
      //   ? valid
      //   : form.get('engagement').get('periodStartDate.entryFormat').value === ViolationsEnum.DATE_HIJIRI
      //   ? form.get('engagement').get('periodStartDate.hijiri').valid
      //   : form.get('engagement').get('periodStartDate.gregorian').valid &&
      //     form.get('engagement').get('periodEndDate.entryFormat').value === ViolationsEnum.DATE_HIJIRI
      //   ? form.get('engagement').get('periodEndDate.hijiri').valid
      //   : form.get('engagement').get('periodEndDate.gregorian').valid && valid;
    } else if (this.isAddNewEng) valid = form.get('engagement').get('isEngAddedBackdated').valid;
    else if (this.isIncorrectReason) valid = form.get('engagement').get('isReasonIncorrected').valid;
    else if (this.isIncorrectWage) valid = true;
    else if (this.isViolatingProvisions) valid = true;
    else if (this.isWrongBenefits) valid = true;
    return valid;
  }
  cancelValid(form) {
    if (form.get('engagement')?.get('isEngagementCancelled')?.get('english').value === ViolationsEnum.BOOLEAN_YES) {
      return true;
    } else if (form.get('engagement').get('calendarType').value === ViolationsEnum.DATE_HIJIRI) {
      return (
        form.get('engagement').get('periodStartDate.hijiri').valid &&
        form.get('engagement').get('periodEndDate.hijiri').valid
      );
    } else if (form.get('engagement').get('calendarType').value === ViolationsEnum.DATE_GREGORIAN) {
      return (
        form.get('engagement').get('periodStartDate.gregorian').valid &&
        form.get('engagement').get('periodEndDate.gregorian').valid
      );
    } else return false;
  }
  getGregorianDate(date) {
    this.calendarService.getGregorianDate(date).subscribe(res => {
      return res?.gregorian;
    });
  }
  setEngValue(form: AbstractControl, index: number, isModify: boolean): RaiseEngagementDetails {
    if (this.isCancelEng) {
      return {
        isFullyCancelled:
          form.get('engagement').get('isEngagementCancelled').get('english').value === ViolationsEnum.BOOLEAN_YES
            ? true
            : false,
        cancelledPeriodStartDate:
          getDateFormat(form.get('engagement').get('periodStartDate').get('entryFormat').value) ===
          ViolationsEnum.DATE_HIJIRI
            ? {
                hijiri: hijiriToJSON(form.get('engagement').get('periodStartDate').get('hijiri').value)
              }
            : {
                gregorian: startOfDay(form.get('engagement').get('periodStartDate').get('gregorian').value)
              },
        cancelledPeriodEndDate:
          getDateFormat(form.get('engagement').get('periodEndDate').get('entryFormat').value) ===
          ViolationsEnum.DATE_HIJIRI
            ? {
                hijiri: hijiriToJSON(form.get('engagement').get('periodEndDate').get('hijiri').value)
              }
            : {
                gregorian: startOfDay(form.get('engagement').get('periodEndDate').get('gregorian').value)
              },
        contributionAmount: form.get('engagement').get('contributionAmount').value,
        engagementId: this.engagementsInfo?.engagements[index]?.engagementId,
        isBenefitEffected: null,
        isEngagementBackdated: null,
        isWageCorrected: null,
        isProvisionsViolating: null,
        recordActionType: isModify ? RecordActionEnum.MODIFY : RecordActionEnum.ADD
      };
    } else if (this.isAddNewEng) {
      return {
        isFullyCancelled: null,
        cancelledPeriodStartDate: null,
        cancelledPeriodEndDate: null,
        contributionAmount: null,
        engagementId: this.engagementsInfo?.engagements[index]?.engagementId,
        isBenefitEffected: null,
        isEngagementBackdated:
          form.get('engagement').get('isEngAddedBackdated').get('english').value === ViolationsEnum.BOOLEAN_YES
            ? true
            : false,
        isWageCorrected: null,
        isProvisionsViolating: null,
        recordActionType: isModify ? RecordActionEnum.MODIFY : RecordActionEnum.ADD
      };
    } else if (this.isIncorrectReason) {
      return {
        isFullyCancelled: null,
        cancelledPeriodStartDate: null,
        cancelledPeriodEndDate: null,
        contributionAmount: null,
        engagementId: this.engagementsInfo?.engagements[index]?.engagementId,
        isBenefitEffected:
          form.get('engagement').get('isReasonIncorrected').get('english').value === ViolationsEnum.BOOLEAN_YES
            ? true
            : false,
        isEngagementBackdated: null,
        isWageCorrected: null,
        isProvisionsViolating: null,
        recordActionType: isModify ? RecordActionEnum.MODIFY : RecordActionEnum.ADD
      };
    } else if (this.isIncorrectWage) {
      return {
        isFullyCancelled: null,
        cancelledPeriodStartDate: null,
        cancelledPeriodEndDate: null,
        contributionAmount: null,
        engagementId: this.engagementsInfo?.engagements[index]?.engagementId,
        isBenefitEffected: null,
        isEngagementBackdated: null,
        isWageCorrected: null,
        isProvisionsViolating: null,
        recordActionType: isModify ? RecordActionEnum.MODIFY : RecordActionEnum.ADD
      };
    } else if (this.isViolatingProvisions) {
      return {
        isFullyCancelled: null,
        cancelledPeriodStartDate: null,
        cancelledPeriodEndDate: null,
        contributionAmount: null,
        engagementId: this.engagementsInfo?.engagements[index]?.engagementId,
        isBenefitEffected: null,
        isEngagementBackdated: null,
        isWageCorrected: null,
        isProvisionsViolating: null,
        recordActionType: isModify ? RecordActionEnum.MODIFY : RecordActionEnum.ADD
      };
    } else if (this.isWrongBenefits) {
      return {
        isFullyCancelled: null,
        cancelledPeriodStartDate: null,
        cancelledPeriodEndDate: null,
        contributionAmount: null,
        engagementId: this.engagementsInfo?.engagements[index]?.engagementId,
        isBenefitEffected: null,
        isEngagementBackdated: null,
        isWageCorrected: null,
        isProvisionsViolating: null,
        recordActionType: isModify ? RecordActionEnum.MODIFY : RecordActionEnum.ADD
      };
    }
  }
  checkforContributorAdded(): number {
    const addedIndex = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
    if (addedIndex < 0) {
      this.raiseViolationData.contributorDetails.push(new RaiseContributorDetails());
      const index = this.raiseViolationData.contributorDetails.length - 1;
      (this.raiseViolationData.contributorDetails[index].socialInsuranceNumber =
        this.contributorSummaryDetails?.socialInsuranceNo),
        (this.raiseViolationData.contributorDetails[index].recordAction = RecordActionEnum.ADD),
        (this.raiseViolationData.contributorDetails[index].engagementDetails = []);
      return index;
    } else {
      const index = this.getContributorIndex(this.contributorSummaryDetails?.socialInsuranceNo);
      this.raiseViolationData.contributorDetails[index].recordAction = RecordActionEnum.MODIFY;
      return index;
    }
  }
  getContributorIndex(socialInsuranceNo) {
    let index = -1;
    this.raiseViolationData?.contributorDetails.forEach((contributor, i) => {
      if (contributor?.socialInsuranceNumber === socialInsuranceNo) index = i;
    });
    return index;
  }
  getDateType(entryFormat: string): string {
    return getDateFormat(entryFormat);
  }

  setBenefitDurationMonth(index: number, benefitType: string) {
    // let isLumpsum=this.lumpsumSet.has(benefitType);
    if (this.addBenefitsForm.controls[index]?.get('benefitAmount').value) {
      this.addBenefitsForm.controls[index].markAllAsTouched();
    }
    this.addBenefitsForm.controls[index]?.get('firstBenefitDate')?.get('gregorian').setValue(null);
    this.addBenefitsForm.controls[index]?.get('lastBenefitDate')?.get('gregorian').setValue(null);
  }
}
