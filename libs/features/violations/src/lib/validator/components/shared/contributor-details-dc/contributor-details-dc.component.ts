/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, BilingualText, CommonIdentity, LanguageToken, LovList } from '@gosi-ui/core';
import { ViolationConstants, getDateFormat } from '@gosi-ui/features/violations/lib/shared';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { InspectionChannel, ViolationValidatorRoles, ViolationsEnum } from '../../../../shared/enums';
import {
  ContributorDetails,
  ContributorsTier,
  ExcludedContributors,
  ViolationTransaction
} from '../../../../shared/models';

@Component({
  selector: 'vol-contributor-details-dc',
  templateUrl: './contributor-details-dc.component.html',
  styleUrls: ['./contributor-details-dc.component.scss']
})
export class ContributorDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  accordionPanel = 1;
  excludedContributors: ExcludedContributors;
  contributorDetail = [];
  engagementDetails = [];
  lang = 'en';
  flags = [];
  exclusionForm: FormGroup = new FormGroup({});
  settlementAmount = 0;
  booleanList: LovList;
  exclusionDetailsForm: FormArray = new FormArray([]);
  channelE_Inspection = InspectionChannel.E_INSPECTION;
  repetetionTierList: LovList;
  saveContributorButtonClicked: boolean;

  /**
   * Input variables
   */
  @Input() isCancelEngagement: boolean;
  @Input() isModifyJoiningDate: boolean;
  @Input() isModifyTerminationDate: boolean;
  @Input() isIncorrectWage: boolean;
  @Input() isaddEngagement: boolean;
  @Input() isIncorrectReason: boolean;
  @Input() transactionDetails: ViolationTransaction;
  @Input() assignedRole: string;
  @Input() parentForm: FormGroup;
  @Input() assigneeIndex: number;
  @Input() isReturn: boolean;
  @Input() isWrongBenefits: boolean = false;
  @Input() isRaiseVioFoVcm: boolean = false;
  @Input() isViolatingProvisions: boolean;
  @Input() contributorsTier: ContributorsTier[] = [];
  @Input() isInjuryViolation: boolean;

  @Output() navigate: EventEmitter<number> = new EventEmitter();
  @Output() navigateToTrasaction: EventEmitter<object> = new EventEmitter();
  @Output() isSameLength: EventEmitter<boolean> = new EventEmitter();
  @Output() viewPreviousViolations: EventEmitter<number> = new EventEmitter();
  @Output() contributorSaved: EventEmitter<boolean> = new EventEmitter();
  @Output() navigateToViolation: EventEmitter<number> = new EventEmitter();

  contributorDetailFlags = [];
  isContributors: boolean;
  isContributorPop: number;
  isViolatedPop: number;
  noPenaltyPopupYes: string = ViolationsEnum.NO_PENALTY_POPUP_YES;
  booleanYes: string = ViolationsEnum.BOOLEAN_YES;
  isVch: boolean;

  /**
   * @param fb
   * @param language
   * @param router
   */
  constructor(
    readonly fb: FormBuilder,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly router: Router,
    readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
    this.repetetionTierList = this.isWrongBenefits
      ? ViolationConstants.REPETITION_TIER_LIST_WRONG_BENEFITS
      : ViolationConstants.REPETETION_TIER_LIST;
    this.booleanList = {
      items: [
        { value: { english: 'Yes', arabic: 'نعم' }, sequence: 0 },
        { value: { english: 'No', arabic: 'لا' }, sequence: 1 }
      ]
    };
    this.noPenaltyPopupYes = ViolationsEnum.NO_PENALTY_POPUP_YES;
    // console.log("c1 tiers",this.contributorsTier);
    // console.log("c2 tiers",this.contributorsTier[0]?.repetitionTierTypeBilingual?.english);
  }

  /**
   * This method is used to handle the changes in the input variables
   * @param changes
   * @memberof InputBaseComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.contributorsTier && changes.contributorsTier.currentValue) {
      this.contributorsTier = changes.contributorsTier.currentValue;
      if (!this.isReturn) {
        this.setAutoRepetetionTier();
        this.setAutoVerification();
      }
    }
    if (changes.transactionDetails && changes.transactionDetails.currentValue) {
      this.transactionDetails = changes.transactionDetails.currentValue;
      this.isVch = this.assignedRole === ViolationValidatorRoles.COMMITEE_HEAD ? true : false;
      this.contributorDetail = this.transactionDetails?.contributors;
      // if(changes.contributorsTier && changes.contributorsTier.currentValue){
      //   this.contributorsTier=changes.contributorsTier.currentValue;
      // }
      // if(this.contributorsTier !== undefined){
      this.transactionDetails?.contributors.forEach((value, i) => {
        this.exclusionDetailsForm.push(this.createExclusionForm());
        this.parentForm.addControl('contributordetails', this.exclusionDetailsForm);
        this.checkIfCompensated(i, value?.contributorId);
        if (this.checkForNoPenalty(value)) {
          value.isNoPenalty = true;
          (this.exclusionDetailsForm as FormArray)?.controls[i]?.get('excluded').setValue(true);
          this.addExcludedPenalty(i, this.isReturn ? false : true);
          this.exclusionDetailsForm.controls[i]
            ?.get('compensated.english')
            ?.setValue(this.booleanList.items[1].value.english);
          this.exclusionDetailsForm.controls[i]
            ?.get('compensated.arabic')
            ?.setValue(this.booleanList.items[1].value.arabic);
          this.setCompensation(i, this.booleanList?.items[1]?.value?.english);
          this.exclusionDetailsForm.controls[i]
            ?.get('repetetionTier.english')
            ?.setValue(this.repetetionTierList?.items[0].value?.english);
          this.exclusionDetailsForm.controls[i]
            ?.get('repetetionTier.arabic')
            ?.setValue(this.repetetionTierList?.items[0].value?.arabic);

          this.setRepetetionTier(i, this.repetetionTierList?.items[0]?.value?.english);
          this.saveContributorDetails(i);
        }
        if (this.getIfExcluded(value?.contributorId) === 1) {
          this.transactionDetails.contributors[i].excluded = true;
        } else {
          this.transactionDetails.contributors[i].excluded = false;
        }
      });
      this.transactionDetails?.contributors.forEach((item, j) => {
        this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.excludedContributors.forEach(element => {
          if (element?.contributorId === item?.contributorId) {
            (this.exclusionDetailsForm as FormArray)?.controls[j].get('excluded').setValue(true);
            this.addExcludedPenalty(j, this.isReturn ? false : true);
          }
        });
        if (this.exclusionDetailsForm.controls[j].valid || this.isViolatingProvisions) {
          (this.exclusionDetailsForm as FormArray)?.controls[j].markAllAsTouched();
          if (this.isReturn) this.saveContributorDetails(j);
        }
      });
      // this.checkIfAllExcluded();
      // }
    }
  }
  checkIfAllExcluded() {
    if (
      this.transactionDetails.contributors.length ===
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.excludedContributors.length
    )
      this.isSameLength.emit(true);
  }

  checkForNoPenalty(contributor: ContributorDetails): boolean {
    let isNoPenalty = true;
    contributor?.engagementInfo.forEach(engagement => {
      if (engagement.isViolationHappenedBeforeFiveYears?.english !== this.noPenaltyPopupYes) isNoPenalty = false;
    });
    return isNoPenalty;
  }
  checkIfCompensated(index: number, contributorId: number) {
    if (this.transactionDetails?.penaltyInfo.length > 0) {
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.excludedContributors.forEach((item, i) => {
        if (item?.contributorId === contributorId) {
          if (item?.compensated === true)
            this.exclusionDetailsForm?.controls[index]
              .get('compensated')
              ?.get('english')
              ?.setValue(ViolationsEnum.BOOLEAN_YES);
          else if (item?.compensated === false)
            this.exclusionDetailsForm?.controls[index]
              .get('compensated')
              ?.get('english')
              ?.setValue(ViolationsEnum.BOOLEAN_NO);
          this.exclusionDetailsForm?.controls[index]
            .get('repetetionTier')
            ?.get('english')
            ?.setValue(item?.repetitionTierType?.english);
          this.exclusionDetailsForm?.controls[index]
            .get('repetetionTier')
            ?.get('arabic')
            ?.setValue(item?.repetitionTierType?.arabic);
          this.setRepetetionTier(index, item?.repetitionTierType?.english);
        }
      });
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.violatedContributors.forEach((item, i) => {
        if (item?.contributorId === contributorId) {
          if (item?.compensated === true)
            this.exclusionDetailsForm?.controls[index]
              .get('compensated')
              ?.get('english')
              ?.setValue(ViolationsEnum.BOOLEAN_YES);
          else if (item?.compensated === false)
            this.exclusionDetailsForm?.controls[index]
              .get('compensated')
              ?.get('english')
              ?.setValue(ViolationsEnum.BOOLEAN_NO);
          this.exclusionDetailsForm?.controls[index]
            .get('repetetionTier')
            ?.get('english')
            ?.setValue(item?.repetitionTierType?.english);
          this.exclusionDetailsForm?.controls[index]
            .get('repetetionTier')
            ?.get('arabic')
            ?.setValue(item?.repetitionTierType?.arabic);
          this.setRepetetionTier(index, item?.repetitionTierType?.english);
        }
      });
    }
  }
  /**
   * Method to get if contributor exlcuded
   * @param index
   */
  getIfExcluded(contributorId: number) {
    let isContributorExcluded = 0;
    this.transactionDetails?.penaltyInfo.forEach((user, j) => {
      if (j !== this.assigneeIndex) {
        this.transactionDetails?.penaltyInfo[j]?.excludedContributors.forEach(val => {
          if (val?.contributorId === contributorId) isContributorExcluded = 1;
        });
      }
    });
    return isContributorExcluded;
  }

  isCommaRequired(contributorId: number, index: number) {
    let isContributorExcluded = 0;
    if (index !== this.assigneeIndex) {
      this.transactionDetails?.penaltyInfo[index]?.excludedContributors.forEach(val => {
        if (val?.contributorId === contributorId) isContributorExcluded = 1;
      });
    }
    return isContributorExcluded;
  }
  /**
   * Method to get age
   * @param index
   */
  getAge(index: number) {
    const age = moment(new Date()).diff(moment(this.contributorDetail[index]?.dateOfBirth?.gregorian), 'year');
    return age;
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
  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  isSinNeeded(identity: Array<CommonIdentity>) {
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
   * Method to get contributor value
   * @param index
   * @param val
   */
  getContributorValue(index, val) {
    this.transactionDetails?.penaltyInfo[val]?.excludedContributors.forEach((items, j) => {
      if (items.contributorId === this.transactionDetails?.contributors[index]?.contributorId) {
        if (j === 0) this.isContributors = false;
        else this.isContributors = true;
        ++j;
        return true;
      } else {
        this.isContributors = false;
        return false;
      }
    });
  }

  /**
   * Method to create exclusion form
   */
  createExclusionForm() {
    return this.fb.group({
      excluded: [null],
      compensated: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      repetetionTier: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      })
    });
  }
  /**
   * Method to set the form value
   * @param i
   * @param compensation
   */
  setCompensation(i, compensation) {
    this.transactionDetails.contributors[i].showMandatoryError = false;
    this.transactionDetails.contributors[i].isSaved = false;
    this.exclusionDetailsForm.controls[i]?.get('compensated.english')?.setValue(compensation);
  }
  /**
   * Method to navigate to establishment profile page
   */
  navigateToProfile(index: number) {
    this.navigate.emit(index);
  }
  /**
   * Method to navigate to transaction tracker page
   */
  navigateToTracker(index: number, engIndex: number) {
    this.navigateToTrasaction.emit({ index: index, engIndex: engIndex, isOh: false });
  }

  /**
   * Method to add the penalty amount
   * @param index
   */
  addExcludedPenalty(index, isActed?: boolean) {
    const excludedContributors = {
      contributorId: this.contributorDetail[index].contributorId,
      contributorName: this.contributorDetail[index].contributorName,
      compensated: this.contributorDetail[index].compensated,
      repetitionTierType: this.contributorDetail[index].repetetionTier,
      totalBenefitAmount: this.contributorDetail[index].totalBenefitAmount
    };
    const violatedContributors = {
      contributionAmount: this.transactionDetails.contributors[index].totalContributionAmount,
      contributorId: this.transactionDetails.contributors[index].contributorId,
      contributorName: this.transactionDetails.contributors[index].contributorName,
      violationAmount: 0,
      compensated: this.contributorDetail[index].compensated,
      repetitionTierType: this.contributorDetail[index].repetetionTier,
      totalBenefitAmount: this.contributorDetail[index].totalBenefitAmount
    };
    if (this.exclusionDetailsForm.controls[index].get('excluded').value === true) {
      this.contributorDetailFlags[index] = true;
      if (this.transactionDetails && this.transactionDetails.contributors[index])
        this.transactionDetails.contributors[index].excluded = true;
      let isexist = false;
      this.exclusionDetailsForm.controls[index]
        .get('compensated.english')
        ?.setValue(this.booleanList.items[1].value.english);
      this.exclusionDetailsForm.controls[index]
        .get('compensated.arabic')
        ?.setValue(this.booleanList.items[1].value.arabic);
      this.setCompensation(index, this.booleanList.items[1].value.english);
      this.exclusionDetailsForm.controls[index]
        .get('repetetionTier.english')
        ?.setValue(this.repetetionTierList?.items[0].value.english);
      this.exclusionDetailsForm.controls[index]
        .get('repetetionTier.arabic')
        ?.setValue(this.repetetionTierList?.items[0].value.arabic);
      this.setRepetetionTier(index, this.repetetionTierList?.items[0].value.english);
      this.transactionDetails.penaltyInfo[this.assigneeIndex].excludedContributors.forEach(element => {
        if (this.transactionDetails?.contributors[index]?.contributorId === element?.contributorId) {
          isexist = true;
        }
      });
      this.transactionDetails?.penaltyInfo[this.assigneeIndex]?.violatedContributors.forEach((item, j) => {
        if (this.transactionDetails?.contributors[index]?.contributorId === item?.contributorId) {
          this.isViolatedPop = j;
        }
      });
      if (!isexist) {
        this.transactionDetails.penaltyInfo[this.assigneeIndex].excludedContributors.push(excludedContributors);
        this.transactionDetails.penaltyInfo[this.assigneeIndex].violatedContributors.splice(this.isViolatedPop, 1);
      }
      // if need to make the tier logic validity check add condition here
    } else {
      this.contributorDetailFlags[index] = false;
      if (this.transactionDetails && this.transactionDetails?.contributors[index]) {
        const isexcluded = this.getIfExcluded(this.transactionDetails?.contributors[index]?.contributorId);
        if (isexcluded === 1) this.transactionDetails.contributors[index].excluded = true;
        else this.transactionDetails.contributors[index].excluded = false;
      }
      this.exclusionDetailsForm.controls[index].get('compensated.english')?.setValue(null);
      this.exclusionDetailsForm.controls[index].get('compensated.arabic')?.setValue(null);
      this.exclusionDetailsForm.controls[index].get('repetetionTier.english')?.setValue(null);
      this.exclusionDetailsForm.controls[index].get('repetetionTier.arabic')?.setValue(null);
      this.exclusionDetailsForm.controls[index].markAsUntouched();
      this.exclusionDetailsForm.controls[index].updateValueAndValidity();
      this.setRepetetionTier(index, null);
      this.transactionDetails.penaltyInfo[this.assigneeIndex].excludedContributors.forEach((item, j) => {
        if (this.transactionDetails?.contributors[index]?.contributorId === item?.contributorId) {
          this.isContributorPop = j;
        }
      });
      this.transactionDetails.penaltyInfo[this.assigneeIndex].excludedContributors.splice(this.isContributorPop, 1);
      this.transactionDetails.penaltyInfo[this.assigneeIndex].violatedContributors.push(violatedContributors);
    }
    this.transactionDetails.contributors[index].isSaved = isActed ? false : true;
  }
  /**
   * Method to set the form value
   * @param i
   * @param compensation
   */
  setRepetetionTier(i, tierValue) {
    this.transactionDetails.contributors[i].showMandatoryError = false;
    this.transactionDetails.contributors[i].isSaved = false;
    this.exclusionDetailsForm.controls[i]?.get('repetetionTier.english')?.setValue(tierValue);
    this.transactionDetails.contributors[i].repetetionTier = new BilingualText();
    this.transactionDetails.contributors[i].repetetionTier = tierValue
      ? this.exclusionDetailsForm?.controls[i]?.get('repetetionTier').value
      : null;
  }

  setAutoRepetetionTier() {
    this.transactionDetails?.contributors.forEach((contributor, i) => {
      let eachContributor = this.contributorsTier.find(contr => contr.contributorId === contributor.contributorId);
      if (eachContributor) {
        this.exclusionDetailsForm.controls[i]
          ?.get('repetetionTier.english')
          ?.setValue(eachContributor?.repetitionTierTypeBilingual?.english);
        this.exclusionDetailsForm.controls[i]
          ?.get('repetetionTier.arabic')
          ?.setValue(eachContributor?.repetitionTierTypeBilingual?.arabic);
        this.transactionDetails.contributors[i].repetetionTier = new BilingualText();
        this.transactionDetails.contributors[i].repetetionTier =
          this.exclusionDetailsForm?.controls[i]?.get('repetetionTier').value;
      }
    });
  }

  setAutoVerification() {
    this.transactionDetails?.contributors.forEach((item, j) => {
      //call Method to set or check  compensation
      this.setAutoCompensation(item, j);
      if (this.exclusionDetailsForm.controls[j].valid || this.isViolatingProvisions) {
        (this.exclusionDetailsForm as FormArray)?.controls[j].markAllAsTouched();
        this.saveContributorDetails(j);
      }
    });
  }

  // Method to set or check compensation ,cal only if its not returned
  setAutoCompensation(contributor: ContributorDetails, index: number) {
    if (contributor?.compensated?.english.toUpperCase() === ViolationsEnum.BOOLEAN_YES.toUpperCase()) {
      this.exclusionDetailsForm?.controls[index]
        .get('compensated')
        ?.get('english')
        ?.setValue(this.booleanList.items[0].value.english);
      this.exclusionDetailsForm?.controls[index]
        .get('compensated')
        ?.get('arabic')
        ?.setValue(this.booleanList.items[0].value.arabic);
    } else {
      this.exclusionDetailsForm?.controls[index]
        .get('compensated')
        ?.get('english')
        ?.setValue(this.booleanList.items[1].value.english);
      this.exclusionDetailsForm?.controls[index]
        .get('compensated')
        ?.get('arabic')
        ?.setValue(this.booleanList.items[1].value.arabic);
    }
  }

  /**Method to view previous violations */
  showViewPreviousViolations(i: number) {
    this.viewPreviousViolations.emit(i);
  }
  setFormValidations(contributorIndex: number) {
    if (this.isRaiseVioFoVcm) {
      this.exclusionDetailsForm.controls[contributorIndex].get('compensated.english').clearValidators();
      this.exclusionDetailsForm.controls[contributorIndex].get('compensated.arabic').clearValidators();
      this.exclusionDetailsForm.controls[contributorIndex].get('compensated').clearValidators();
      this.exclusionDetailsForm.controls[contributorIndex].get('compensated.english').updateValueAndValidity();
      this.exclusionDetailsForm.controls[contributorIndex].get('compensated.arabic').updateValueAndValidity();
      this.exclusionDetailsForm.controls[contributorIndex].get('compensated').updateValueAndValidity();
      if (this.isViolatingProvisions) {
        this.exclusionDetailsForm.controls[contributorIndex]?.get('repetetionTier.english').clearValidators();
        this.exclusionDetailsForm.controls[contributorIndex]?.get('repetetionTier.arabic').clearValidators();
        this.exclusionDetailsForm.controls[contributorIndex]?.get('repetetionTier').clearValidators();
        this.exclusionDetailsForm.controls[contributorIndex]?.get('repetetionTier.english').updateValueAndValidity();
        this.exclusionDetailsForm.controls[contributorIndex]?.get('repetetionTier.arabic').updateValueAndValidity();
        this.exclusionDetailsForm.controls[contributorIndex]?.get('repetetionTier').updateValueAndValidity();
      }
    }
  }
  /**Method to save */
  saveContributorDetails(contributorIndex: number, saveContributorButtonClicked?: boolean) {
    this.saveContributorButtonClicked = saveContributorButtonClicked ? true : false;
    this.setFormValidations(contributorIndex);
    this.exclusionDetailsForm.controls[contributorIndex].markAllAsTouched();
    if (this.exclusionDetailsForm.controls[contributorIndex].valid) {
      this.transactionDetails.contributors[contributorIndex].showMandatoryError = false;
      this.transactionDetails.contributors[contributorIndex].isSaved = true;
      this.contributorSaved.emit(this.saveContributorButtonClicked);
      this.accordionPanel = -1;
    } else {
      this.transactionDetails.contributors[contributorIndex].isSaved = false;
      this.transactionDetails.contributors[contributorIndex].showMandatoryError = true;

      const element = document.getElementById(String(contributorIndex));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    }
  }
  getDateType(format: string): string {
    return getDateFormat(format);
  }
  checkIfLumpsum(benefitType: string) {
    let lumpsum = false;

    if (ViolationConstants.BENEFIT_TYPE_LUMPSUM_LIST.includes(benefitType)) {
      lumpsum = true;
    }
    return lumpsum;
  }
  // Method to navigate to violation profile
  navigateViolationDetails(vid: number) {
    this.navigateToViolation.emit(vid);
  }
}
