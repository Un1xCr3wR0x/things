/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import {
  LovList,
  Lov,
  GosiCalendar,
  CommonIdentity,
  checkIqamaOrBorderOrPassport,
  dayDifference,
  GenderEnum,
  AlertService
} from '@gosi-ui/core';
import { SystemParameter } from '@gosi-ui/features/contributor';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  DependentDetails,
  ValidateRequest,
  SearchPerson,
  PersonalInformation,
  HeirPersonIds,
  AttorneyDetailsWrapper,
  AgeInNewLaw
} from '../../models';
import moment from 'moment';
import { BenefitValues } from '../../enum';
import { ActionType } from '../../enum/action-type';
import { getIdLabel } from '../../utils/benefitUtil';
import { ModifyBenefitService } from '../../services';

@Component({
  selector: 'bnt-heir-modify-status-dc',
  templateUrl: './heir-modify-status-dc.component.html',
  styleUrls: ['./heir-modify-status-dc.component.scss']
})
export class HeirModifyStatusDcComponent implements OnInit, OnChanges {
  relationship: string;
  reasonForm: FormGroup;
  showNewBornForm = false;
  showSaveCancel = true;
  isDeathOfChild = false;
  isUnborn = false;
  marriageGrantDisplay = false;
  isDateEditable = true;
  validatorValue: string;
  reasonForModification: Lov;
  maxDateGregorian: Date;
  relationshipForNewborn$: BehaviorSubject<LovList> = new BehaviorSubject<LovList>(null);
  separatorLimit = 10000000000000; //BillingConstants.AMOUNT_RECEIVED_SEPARATOR_LIMIT;

  /** input and Output  */
  @Input() heirDetails: DependentDetails[] = [];
  @Input() heirDetail: DependentDetails;
  @Input() systemParameter: SystemParameter;
  // @Input() reasonList: LovList;
  @Input() reasonsList: LovList;
  @Input() heirStatusUpdated: ValidateRequest;
  @Input() heirStatusResp: ValidateRequest;
  @Input() unborn: PersonalInformation;
  @Input() systemRunDate: GosiCalendar;
  @Input() contributorDeathOrMissingDate: GosiCalendar;

  //Heir add edit
  @Input() unbornPositionInArray: number; //To remove the unborn from array using index
  @Input() nationalityList$: Observable<LovList>;
  @Input() attorneyDetailsWrapper: AttorneyDetailsWrapper[];
  @Input() payeeList: LovList;
  @Input() heirList: LovList;
  @Input() listOfGuardians: DependentDetails[];
  @Input() paymentMethodList: LovList;
  @Input() guardianDetails: PersonalInformation;
  @Input() parentForm: FormGroup;
  @Input() isValidator: boolean;
  @Input() annuityRelationShip: LovList;
  @Input() maritalStatusList: LovList;
  @Input() heirStatus: LovList;
  @Input() heirStatusArr: string[];
  @Input() lang = 'en';
  @Input() validateApiResponse: ValidateRequest;
  @Input() isPension = false;
  @Input() ageInNewLaw: AgeInNewLaw[] = [];

  /**
   * Output
   */
  @Output() validateHeir: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() getBankForid: EventEmitter<number> = new EventEmitter();
  @Output() searchForGuardian: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() getAuthPeronContactDetails: EventEmitter<HeirPersonIds> = new EventEmitter();

  @Output() cancelEdit = new EventEmitter();
  @Output() validateHeirModifyReason = new EventEmitter();
  @Output() statusDate = new EventEmitter();
  @Output() saveHeirStatus: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() searchUnborn: EventEmitter<SearchPerson> = new EventEmitter();
  @Output() resetUnbornSearch: EventEmitter<null> = new EventEmitter();
  @Output() addValidatedHeir: EventEmitter<DependentDetails> = new EventEmitter();
  @Output() isThisAgeInNewLaw: EventEmitter<AgeInNewLaw[]> = new EventEmitter<AgeInNewLaw[]>();

  idValue: string;
  idLabel: string;
  // reasonList: Lov[] = [];

  constructor(
    public fb: FormBuilder,
    readonly alertService: AlertService,
    public modifyBenefitService: ModifyBenefitService
  ) {}

  ngOnInit(): void {
    this.reasonForm = this.createReasonForm();
    // this.reasonList = this.heirDetail.reasonForModifyLov;
  }

  /*
   * This method is to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.unborn && changes.unborn.currentValue) {
        const idObj: CommonIdentity | null = this.unborn.identity.length
          ? checkIqamaOrBorderOrPassport(this.unborn.identity)
          : null;
        if (idObj) {
          this.idValue = idObj?.id.toString();
          this.idLabel = getIdLabel(idObj);
        }
        if (this.unborn.sex) {
          this.populateRelationshipValues(this.unborn.sex.english);
        }
      }
      if (changes.heirDetails && changes.heirDetails.currentValue) {
        this.relationship = this.heirDetail.relationship.english;
      }
      if (changes.systemRunDate && changes.systemRunDate.currentValue) {
        this.maxDateGregorian = moment(changes.systemRunDate.currentValue.gregorian).toDate();
      }
      if (changes && changes.nationalityList$?.currentValue) {
        this.nationalityList$ = changes.nationalityList$.currentValue;
      }
      this.setHeirStatusChanges(changes);
    }
  }
  setHeirStatusChanges(changes: SimpleChanges) {
    if (changes && changes.heirStatusUpdated && changes.heirStatusUpdated.currentValue) {
      if (this.heirStatusUpdated.income !== null) {
        //If not null change monthly wage selected
        //To edit current monthly wage
        this.reasonForm.addControl('income', new FormControl(this.heirStatusUpdated.income));
        this.reasonForm.removeControl('statusDate');
      } else if (!this.reasonForm.get('statusDate')) {
        this.reasonForm.addControl('statusDate', new FormControl('', Validators.required));
        this.reasonForm.removeControl('income');
      }
      if (
        this.relationship === BenefitValues.sister ||
        this.relationship === BenefitValues.mother ||
        this.relationship === BenefitValues.granddaughter ||
        this.relationship === BenefitValues.grandmother ||
        this.relationship === BenefitValues.daughter
      ) {
        if (this.heirStatusUpdated.status.english === BenefitValues.married) {
          this.marriageGrantDisplay = true;
        }
      }
      if (
        this.reasonForModification &&
        (this.reasonForModification?.value.english === BenefitValues.joiningWork ||
          this.reasonForModification.value.english === BenefitValues.leavingWork)
      ) {
        if (this.heirStatusUpdated?.eventDate) {
          this.isDateEditable = false;
          this.reasonForm.get('statusDate').patchValue(this.heirStatusUpdated?.eventDate);
        } else {
          this.isDateEditable = true;
        }
      }
    }
  }
  createReasonForm() {
    return this.fb.group({
      reasonSelect: this.fb.group({
        english: [null, Validators.required],
        arabic: [null]
      }),
      statusDate: this.fb.group({
        gregorian: [null, Validators.required],
        hijiri: [null],
        entryFormat: [null]
      })
    });
  }

  search(data: SearchPerson) {
    this.searchUnborn.emit(data);
  }

  /*
   * This method is for cancel action
   */
  cancelEditForm() {
    this.cancelEdit.emit();
  }

  reasonSelected(reason: Lov) {
    this.heirStatusUpdated = null;
    if (reason && reason.value.english === BenefitValues.birthOfChild) {
      this.showNewBornForm = true;
      this.showSaveCancel = false;
      this.reasonForModification = reason;
      this.isDeathOfChild = false;
      this.isUnborn = true;
    } else {
      if (reason && reason.value.english === BenefitValues.deathOfChild) {
        this.isDeathOfChild = true;
        this.isUnborn = true;
      } else {
        this.isDeathOfChild = false;
        this.isUnborn = false;
      }
      this.showNewBornForm = false;
      this.showSaveCancel = true;
      this.reasonForModification = reason;
      const dependent = {
        actionType: ActionType.MODIFY,
        dateOfBirth: this.heirDetail.birthDate,
        personId: this.heirDetail.personId,
        relationship: this.heirDetail.relationship,
        maritalStatus: this.heirDetail.maritalStatus,
        disabilityDescription: this.heirDetail.disabilityDescription,
        reasonForModification: this.reasonForModification.value
      };
      this.validateHeirModifyReason.emit(dependent);
    }
  }
  selectRelation() {
    this.showSaveCancel = true;
  }
  /** Populate heir dropdown list */
  populateRelationshipValues(sex) {
    const list: Lov[] = [];
    if (sex === GenderEnum.FEMALE) {
      list.push({
        value: {
          english: 'Daughter',
          arabic: 'بنت'
        },
        code: 1005,
        sequence: 5
      });
    } else {
      list.push({
        value: {
          english: 'Son',
          arabic: 'ابن'
        },
        code: 1004,
        sequence: 4
      });
    }
    this.relationshipForNewborn$.next(new LovList(list));
  }
  /**
   * When Save button clicked
   */
  saveStatus() {
    let saveStatus = true;
    if (this.reasonForm.valid) {
      if (this.reasonForm.get('statusDate')) {
        //For monthly wage edit no statusDate will be there
        if (this.isFutureDate(this.reasonForm.get('statusDate').value)) {
          this.alertService.showErrorByKey('BENEFITS.MAX-DATE-STATUS');
          saveStatus = false;
        } else if (
          // this.isDateEditable &&
          this.contributorDeathOrMissingDate &&
          dayDifference(
            this.contributorDeathOrMissingDate.gregorian,
            this.reasonForm.get('statusDate').value.gregorian
          ) < 0
        ) {
          //if status date is updated to a date before main beneficiary's death date/ missing date, below error to be displayed
          this.alertService.showErrorByKey('BENEFITS.HEIR-STATUS-DATE-ERROR');
          saveStatus = false;
        }
      }
      if (saveStatus) {
        this.alertService.clearAlerts();
        const dependent = {
          actionType: ActionType.MODIFY,
          dependentSource: this.heirDetail.dependentSource ? this.heirDetail.dependentSource : BenefitValues.gosi,
          personId: this.heirDetail.personId,
          statusDate: this.reasonForm.get('statusDate') ? this.reasonForm.get('statusDate').value : null,
          reasonForModification: this.reasonForModification.value,
          heirStatus: this.heirStatusUpdated.status ? this.heirStatusUpdated.status : null,
          status: this.heirStatusUpdated.pensionStatus,
          income: this.reasonForm.get('income') ? this.reasonForm.get('income').value : null,
          existingIncome: this.heirStatusUpdated.existingIncome,
          relationship: this.heirDetail.relationship
        };
        if (
          this.reasonForModification?.value?.english === BenefitValues.disabled ||
          this.reasonForModification?.value?.english === BenefitValues.changeInMonthlyWage
        ) {
          this.validateHeirModifyReason.emit(dependent);
        } else {
          this.statusDate.emit(dependent);
        }
      }
    } else {
      // if (this.reasonForm.get('statusDate').value.gregorian === null) {
      this.alertService.showErrorByKey('BENEFITS.MANDATORY-FIELDS');
      // }
      this.reasonForm.markAllAsTouched();
    }
  }

  validateUnbornHeir(event) {
    event.motherId = this.heirDetail.motherId;
    this.validateHeir.emit(event);
  }

  resetSearch() {
    this.resetUnbornSearch.emit();
  }
  isFutureDate(date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (date.gregorian > JSON.parse(JSON.stringify(now))) {
      return true;
    } else {
      return false;
    }
  }

  getBank(event) {
    this.getBankForid.emit(event);
  }

  searchHeirGuardian(event) {
    this.searchForGuardian.emit(event);
  }

  getAuthorizedPersonContact(event) {
    this.getAuthPeronContactDetails.emit(event);
  }

  addHeir(heir: DependentDetails) {
    this.addValidatedHeir.emit(heir);
  }
}
