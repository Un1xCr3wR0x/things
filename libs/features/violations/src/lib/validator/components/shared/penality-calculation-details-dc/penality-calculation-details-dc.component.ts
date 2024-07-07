/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BilingualText, greaterThanValidator, Lov } from '@gosi-ui/core';
import { checkContributorsSaved } from '@gosi-ui/features/violations/lib/shared/utils/violation-utils';
import { ViolationConstants } from '../../../../shared/constants';
import { ViolationClassEnum, ViolationCommitteEnum, ViolationValidatorRoles } from '../../../../shared/enums';
import {
  AutoTierClass,
  ClassValueEmit,
  PenaltyDetails,
  PenaltyInfoResponse,
  ViolationTransaction
} from '../../../../shared/models';

@Component({
  selector: 'vol-penality-calculation-details-dc',
  templateUrl: './penality-calculation-details-dc.component.html',
  styleUrls: ['./penality-calculation-details-dc.component.scss']
})
export class PenalityCalculationDetailsDcComponent implements OnInit, OnChanges {
  //Local variables
  penaltyForm: FormGroup;
  justificationMaxLength = ViolationConstants.JUSTIFICATION_MAX_LENGTH;
  totalRecords = 0;
  isIconRequired = true;
  doNotImposePenalty = ViolationClassEnum.DO_NOT_IMPOSE_PENALTY;
  othersExcludedPenaltyForm: FormGroup;
  noImposePenalty: Boolean = false;
  isPrepopulateClass: Boolean;
  classValueEmit: ClassValueEmit;
  /**
   * Input variables
   */
  @Input() violationClassList: Lov[];
  @Input() isCancelEngagement: boolean;
  @Input() isModifyTerminationDate: boolean;
  @Input() isIncorrectWage: boolean;
  @Input() parentForm: FormGroup;
  @Input() assigneeId: string;
  @Input() assigneeName: string;
  @Input() assignedRole: string;
  @Input() assigneeIndex: number;
  @Input() isReturn: boolean;
  @Input() allExcluded: boolean;
  @Input() notAllExcluded: boolean;
  @Input() penaltyCalculationResponse: PenaltyInfoResponse;
  @Input() transactionDetails: ViolationTransaction;
  @Input() penaltyInfoDetails: PenaltyDetails[] = new Array<PenaltyDetails>();
  @Input() penaltyArrayLen: number[] = new Array<number>();
  @Input() showVcAlert: boolean;
  @Input() isRaiseVioFoVcm: boolean = false;
  @Input() isViolatingProvisions: boolean = false;
  @Input() hideOptionalLabel = true;
  @Input() autoTierClass: AutoTierClass;
  @Input() saveContributorButtonClicked: boolean;

  /**
   * Output variables
   */
  @Output() excludeContributor: EventEmitter<number> = new EventEmitter();
  @Output() classValue: EventEmitter<ClassValueEmit> = new EventEmitter();
  @Output() penalityDetails: EventEmitter<Object> = new EventEmitter();
  @Output() isExcluded: EventEmitter<boolean> = new EventEmitter();
  @Output() contributorLength: EventEmitter<number> = new EventEmitter();
  classDetails: BilingualText;
  zeroPenalty = 0;
  committeeType: string;
  isVch: boolean;

  constructor(readonly fb: FormBuilder) {}
  /**
   * Local Variables
   */
  comments: FormControl = new FormControl(null, { updateOn: 'blur' });
  justification: FormControl = new FormControl(null, { updateOn: 'blur' });
  penaltyAmount: FormControl = new FormControl(null, {
    validators: Validators.compose([greaterThanValidator(0), Validators.required]),
    updateOn: 'blur'
  });
  selectNotImposePenalty: FormControl = new FormControl(null);
  /**
   * Method For Initializing
   */
  ngOnInit(): void {
    this.comments.disable();
    this.comments.setValue('Justifications');
    this.comments.setValidators(Validators.required);
    this.justification.setValidators(Validators.required);
    this.penaltyForm = this.createPenaltyForm();
    this.othersExcludedPenaltyForm = this.createOthersPenaltyForm();
    this.parentForm.addControl('penalty', this.penaltyForm);
    this.parentForm.addControl('justification', this.justification);
    if (this.isViolatingProvisions) this.parentForm?.addControl('selectNotImposePenalty', this.selectNotImposePenalty);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isReturn) this.isReturn = changes.isReturn.currentValue;
    if (changes.transactionDetails) {
      this.transactionDetails = changes.transactionDetails.currentValue;
      this.isVch = this.assignedRole === ViolationValidatorRoles.COMMITEE_HEAD ? true : false;
    }
    if (changes.saveContributorButtonClicked) {
      this.saveContributorButtonClicked = changes.saveContributorButtonClicked.currentValue;
    }
    if (
      ((this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.selectedViolationClass && this.violationClassList) ||
        this.isViolatingProvisions) &&
      (this.isReturn || this.showVcAlert)
    ) {
      this.justification.setValue(this.transactionDetails.penaltyInfo[this.assigneeIndex].justification);
      this.penaltyAmount.setValue(this.transactionDetails.penaltyInfo[this.assigneeIndex].penaltyAmount);
      const classValue = this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.selectedViolationClass;
      this.violationClassList?.forEach(res => {
        if (res?.value?.english === classValue?.english) {
          this.classDetails = res.value;
        }
      });
    }
    if (changes.autoTierClass) {
      this.autoTierClass = changes.autoTierClass.currentValue;
      if (this.autoTierClass?.violationClass?.english && !this.isReturn) {
        this.isPrepopulateClass = true;
        this.violationClassList?.forEach(res => {
          if (res?.value?.english === this.autoTierClass?.violationClass?.english) {
            this.classDetails = res?.value;
          }
        });
      }
    }
    this.checkForNullJustification();
    if (changes.allExcluded) {
      this.allExcluded = changes.allExcluded.currentValue;
    }
    if (changes.notAllExcluded) {
      this.notAllExcluded = changes.notAllExcluded.currentValue;
    }
    if (changes.noImposePenalty) {
      this.noImposePenalty = changes.noImposePenalty.currentValue;
    }

    if (changes.violationClassList && changes.violationClassList.currentValue) {
      this.isPrepopulateClass = this.saveContributorButtonClicked ? false : this.isPrepopulateClass;
      if (this.isPrepopulateClass && !this.isReturn) {
        this.violationClassList?.forEach(res => {
          if (res?.value?.english === this.autoTierClass?.violationClass?.english) {
            this.classDetails = res?.value;
          }
        });
      }
      this.penaltyForm = this.createPenaltyForm();
      if (this.penaltyForm.get('penalty.english').value === null && !this.isPrepopulateClass) {
        this.penaltyCalculationResponse = null;
      } else {
        this.classDetails = this.allExcluded ? null : this.classDetails;
        this.classValueEmit = new ClassValueEmit();
        this.classValueEmit.violationClassType =
          (this.isReturn || this.showVcAlert || this.isPrepopulateClass) && this.classDetails
            ? this.classDetails
            : this.violationClassList[0].value;
        this.classValueEmit.isPrepopulate = this.isPrepopulateClass;
        this.classValue.emit(this.classValueEmit);
      }
    }
    if (this.isViolatingProvisions) {
      this.parentForm.addControl('penaltyAmount', this.penaltyAmount);
    }
    this.setPenalty();
  }

  checkForNullJustification() {
    if (this.showVcAlert && !this.isReturn) {
      this.justification.setValue(null);
    }
  }
  othersNotImposePenalty() {
    if (
      this.transactionDetails?.contributors?.length === 0 &&
      this.parentForm?.get('selectNotImposePenalty').value === true
    ) {
      this.noImposePenalty = true;
      this.othersExcludedPenaltyForm.disable();
      this.parentForm.addControl('othersExcludedPenaltyForm', this.createOthersPenaltyForm());
      this.parentForm.get('othersExcludedPenaltyForm').disable();
      this.parentForm.get('penaltyAmount').setValue(null);
      this.parentForm.get('penaltyAmount').clearValidators();
    } else {
      this.noImposePenalty = false;
      this.parentForm.removeControl('othersExcludedPenaltyForm');
      this.parentForm.get('penaltyAmount').setValidators([greaterThanValidator(0), Validators.required]);
      // this.setPenalty();
    }
  }
  setPenalty() {
    if (this.allExcluded === true && this.violationClassList) {
      const dataForm = this.createPenaltyForm();
      this.penaltyForm.get('penalty').disable();
      this.parentForm.removeControl('penalty');
      this.parentForm.addControl('penalty', dataForm);
      this.isIconRequired = false;
      if (this.isViolatingProvisions && !this.noImposePenalty) {
        this.noImposePenalty = false;
        this.parentForm.get('penaltyAmount').setValue(null);
        this.parentForm.get('penaltyAmount').clearValidators();
        this.othersExcludedPenaltyForm.disable();
        this.parentForm.addControl('othersExcludedPenaltyForm', this.createOthersPenaltyForm());
        this.parentForm.get('othersExcludedPenaltyForm').disable();
      }
    } else {
      this.isIconRequired = true;
      this.penaltyForm?.get('penalty').enable();
      if (this.parentForm && this.penaltyForm) {
        this.parentForm.removeControl('penalty');
        this.parentForm.addControl('penalty', this.penaltyForm);
      }
      if (this.isViolatingProvisions) {
        this.parentForm.get('penaltyAmount').setValidators([greaterThanValidator(0), Validators.required]);
      }
    }
  }
  setJustification() {
    this.transactionDetails.penaltyInfo[this.assigneeIndex].justification = this.justification.value;
  }

  createPenaltyForm() {
    return this.fb.group({
      penalty: this.fb.group({
        english: [
          this.allExcluded
            ? this.violationClassList[0].value?.english
            : (this.isReturn || this.showVcAlert || this.isPrepopulateClass) && this.classDetails
            ? this.classDetails.english
            : null,
          { validators: Validators.required }
        ],
        arabic: [
          this.allExcluded
            ? this.violationClassList[0].value.arabic
            : (this.isReturn || this.showVcAlert || this.isPrepopulateClass) && this.classDetails
            ? this.classDetails.arabic
            : null
        ]
      })
    });
  }
  createOthersPenaltyForm() {
    return this.fb.group({
      english: [
        this.allExcluded || this.noImposePenalty
          ? this.violationClassList[0].value?.english
          : (this.isReturn || this.showVcAlert) && this.classDetails
          ? this.classDetails.english
          : null
      ],
      arabic: [
        this.allExcluded || this.noImposePenalty
          ? this.violationClassList[0].value?.arabic
          : (this.isReturn || this.showVcAlert) && this.classDetails
          ? this.classDetails.arabic
          : null
      ]
    });
  }

  selectPenaltyClass(item: Lov) {
    this.isPrepopulateClass = false;
    if (item === null) {
      this.penaltyCalculationResponse = null;
    } else {
      this.classValueEmit = new ClassValueEmit();
      this.classValueEmit.violationClassType = item.value;
      this.classValueEmit.isPrepopulate = this.isPrepopulateClass;
      this.classValue.emit(this.classValueEmit);
    }
  }
  checkIsExcluded(i) {
    let isexist = 0;
    this.transactionDetails.penaltyInfo.forEach(item => {
      item.excludedContributors.forEach(element => {
        if (element.contributorId === this.transactionDetails.contributors[i].contributorId) {
          isexist = 1;
        }
      });
    });
    return isexist;
  }
  /**
   * Show Exclude Contributor Details
   */
  showExcludeContributorDetails() {
    this.totalRecords = 0;
    if (this.transactionDetails && this.transactionDetails.contributors) {
      this.transactionDetails.contributors.forEach((value, i) => {
        if (value.excluded) this.totalRecords++;
      });
    }
    this.excludeContributor.emit(this.totalRecords);
  }

  getRole(role) {
    if (role === ViolationValidatorRoles.COMMITEE_HEAD) {
      return ViolationCommitteEnum.VIOLATION_COMMITTEE_HEAD;
    } else {
      return ViolationCommitteEnum.VIOLATION_COMMITTEE_MEMBER;
    }
  }

  /**
   * Show Penality Details
   */
  showPenalityDetails(index: number, isCurrentMember: boolean) {
    this.penalityDetails.emit({
      index: index,
      isCurrentMember: isCurrentMember,
      isCancelEngagement: this.isCancelEngagement
    });
  }
  calculateExcluded(index) {
    const len = this.transactionDetails?.penaltyInfo[index]?.excludedContributors.length;
    this.contributorLength.emit(len);
    return len;
  }
  checkAnyExcluded() {
    let isexcluded = 0;
    this.transactionDetails?.penaltyInfo.forEach((item, i) => {
      if ((i === this.assigneeIndex || this.isVch) && item?.excludedContributors.length > 0) {
        isexcluded = 1;
      }
    });
    return isexcluded;
  }
}
