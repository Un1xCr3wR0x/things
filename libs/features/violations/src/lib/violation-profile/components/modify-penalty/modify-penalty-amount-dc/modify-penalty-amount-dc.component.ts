/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, greaterThanValidator, LovList, markFormGroupTouched, CommonIdentity } from '@gosi-ui/core';
import { ViolationConstants, ViolationsEnum, ViolationTypeEnum } from '@gosi-ui/features/violations/lib/shared';
import { ChangeViolationValidator, ViolationTransaction } from '../../../../shared/models';

@Component({
  selector: 'vol-modify-penalty-amount-dc',
  templateUrl: './modify-penalty-amount-dc.component.html',
  styleUrls: ['./modify-penalty-amount-dc.component.scss']
})
export class ModifyPenaltyAmountDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  amounts = 5000;
  branchListValue: FormArray = new FormArray([]);
  checkForm: FormGroup;
  excluded = 0;
  id;
  initialPenaltyAmount = 0;
  modified = 0;
  modifiedRecords = [];
  modifyPenaltyForm: FormGroup;
  totalCurrentPenalty = 0;
  totalNewPenaltyValue = 0;
  commentsMaxLength = ViolationConstants.JUSTIFICATION_MAX_LENGTH;
  showComments: boolean;
  /**
   * Pagination variables
   */
  currentPage = 1;
  itemsPerPage = 7;
  noOfRecords = 0;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  isViolatingProvision: boolean;

  //Input variables
  @Input() modifyReasonList: LovList;
  @Input() transactionDetails: ViolationTransaction;
  @Input() editMode: boolean;
  @Input() violationDetails: ChangeViolationValidator = new ChangeViolationValidator();
  @Input() isSimisFlag: boolean;
  @Input() noContributors: boolean;
  //Output variables
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() errorFlag: EventEmitter<null> = new EventEmitter();
  @Output() submit = new EventEmitter();

  /**
   *
   * @param fb
   */
  constructor(readonly fb: FormBuilder) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {}
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.transactionDetails && changes.transactionDetails.currentValue) {
      this.modifyPenaltyForm = this.createModifyPenaltyForm();
      this.isViolatingProvision =
        this.transactionDetails?.violationType?.english === ViolationTypeEnum?.VIOLATING_PROVISIONS ? true : false;
    }
    if (changes.violationDetails && changes.violationDetails.currentValue)
      this.violationDetails = changes.violationDetails.currentValue;
    if (changes.editMode && changes.editMode.currentValue) {
      this.editMode = changes.editMode.currentValue;
    }
    if (changes.isSimisFlag && changes.isSimisFlag.currentValue) {
      this.isSimisFlag = changes.isSimisFlag.currentValue;
    }
    if (changes.noContributors && changes.noContributors.currentValue) {
      this.noContributors = changes.noContributors.currentValue;
    }
    this.initializeView();
  }
  initializeView() {
    if (this.transactionDetails) {
      this.transactionDetails.contributors.forEach(item => {
        item.newPenaltyAmount = item.penaltyAmount;
      });
      // this.isSimisFlag = this.transactionDetails.isSimisViolation;
      this.transactionDetails.contributors = this.transactionDetails.contributors
        ?.filter(contributor => contributor.excluded !== true)
        .filter(person => person.excludedInModify !== true);
      this.noOfRecords = this.transactionDetails.contributors?.length;
      this.modifiedRecords = new Array(this.noOfRecords);
      this.createFormData();
      this.totalNewPenaltyValue = this.transactionDetails?.penaltyAmount;
      this.modifyPenaltyForm.get('newPenalty').setValue(this.transactionDetails?.penaltyAmount);
    }
    this.setModifiedValues();
  }
  setModifiedValues() {
    this.modified = 0;
    this.excluded = 0;
    if (this.violationDetails && this.editMode) {
      if (!(this.isSimisFlag || this.isViolatingProvision)) {
        (this.branchListValue as FormArray).controls?.forEach((amount, i) => {
          if (
            this.transactionDetails.contributors[i].contributorId ===
            this.violationDetails?.contributors[i].contributorId
          )
            amount.get('newPenalty')?.setValue(this.violationDetails?.contributors[i]?.newPenaltyAmount);
          amount.get('checkBoxFlag').setValue(this.violationDetails?.contributors[i].isExcluded);
          if (amount.get('checkBoxFlag').value) {
            amount.get('newPenalty').disable();
            this.excluded++;
          }
          if (
            amount.get('newPenalty').value !== this.violationDetails?.contributors[i]?.currentPenaltyAmount &&
            !amount.get('checkBoxFlag').value
          )
            this.modified++;
        });
        this.setExcludedValue();
      } else {
        this.modifyPenaltyForm.get('newPenalty')?.setValue(this.violationDetails?.newPenaltyAmount);
      }
      this.modifyPenaltyForm?.get('modifyReason.english')?.setValue(this.violationDetails?.modificationReason?.english);
      this.modifyPenaltyForm?.get('modifyReason.arabic')?.setValue(this.violationDetails?.modificationReason?.arabic);
      const value = this.modifyPenaltyForm?.get('modifyReason').value;
      this.modifyPenaltyForm?.get('comments').setValue(this.violationDetails?.comments);
      if (this.modifyPenaltyForm) this.selectReasonForModify(value?.english);
      this.totalNewPenaltyValue = this.violationDetails?.newPenaltyAmount;
    }
  }
  setExcludedValue() {
    this.transactionDetails?.contributors.forEach(contributor => {
      this.violationDetails?.contributors.forEach(item => {
        if (contributor.contributorId === item.contributorId) contributor.excluded = item?.isExcluded;
      });
    });
  }
  /**
   * Method to create penalty form
   */
  createModifyPenaltyForm(): FormGroup {
    return this.fb.group({
      modifyReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      checkBoxFlag: [false],
      newPenalty: ['0', { validators: Validators.required }],
      comments: [null]
    });
  }
  /**
   * Method to create the branchListValue form data
   */
  createFormData() {
    this.transactionDetails?.contributors.forEach(() => {
      this.branchListValue.push(this.createCheckForm());
    });
    (this.branchListValue as FormArray).controls?.forEach((amount, i) => {
      amount.get('newPenalty')?.setValue(this.transactionDetails?.contributors[i]?.newPenaltyAmount);
    });
  }
  /**
   * Method to create the Check form data
   */
  createCheckForm(): FormGroup {
    return this.fb.group({
      checkBoxFlag: [false],
      newPenalty: [null]
    });
  }
  /**
   * Method to get new penalty amount
   * @param j
   */
  getNewPenalty(j?: number) {
    this.totalNewPenaltyValue = this.initialPenaltyAmount;
    (this.branchListValue as FormArray).controls.forEach((penaltyValue, h) => {
      const penaltyAmount = penaltyValue.get('newPenalty');
      if (penaltyAmount.enabled) {
        if (penaltyAmount.value === null || penaltyAmount.value === '' || penaltyAmount.value === '.') {
          penaltyAmount.setValue(Number(this.transactionDetails.contributors[h].penaltyAmount));
          penaltyAmount.updateValueAndValidity();
          this.transactionDetails.contributors[h].newPenaltyAmount = this.transactionDetails.contributors[
            h
          ].penaltyAmount;
        } else {
          this.transactionDetails.contributors[h].newPenaltyAmount = Number(penaltyAmount.value);
        }
        this.totalNewPenaltyValue = this.totalNewPenaltyValue + Number(penaltyAmount.value);
      } else {
        this.transactionDetails.contributors[h].newPenaltyAmount = 0;
      }
      if (penaltyAmount.value === null || penaltyAmount.value === '' || penaltyAmount.value === '.') {
        penaltyAmount.setValue(null);
        penaltyAmount.updateValueAndValidity();
      } else if (Number(penaltyAmount.value) === 0) {
        penaltyAmount.setValidators(greaterThanValidator(0));
        penaltyAmount.updateValueAndValidity();
      } else {
        penaltyAmount.setValue(this.transactionDetails.contributors[h].newPenaltyAmount);
        penaltyAmount.updateValueAndValidity();
      }
    });
    if (this.transactionDetails && this.transactionDetails.contributors[j]) {
      if (
        this.transactionDetails.contributors[j]?.newPenaltyAmount !==
        this.transactionDetails.contributors[j].penaltyAmount
      )
        this.modifiedRecords[j] = 1;
      else this.modifiedRecords[j] = 0;
      this.modified = this.modifiedRecords.filter(val => val === 1).length;
    }
  }
  /**
   * Method to select the corresponding establishment
   * @param event
   * @param i
   */
  selectEstablishment(event, i) {
    const penalty = (this.branchListValue as FormArray).controls[this.absoluteIndex(i)].get('newPenalty');
    if (event === 'true') {
      if (
        penalty.value !== null &&
        penalty.value !== '' &&
        this.transactionDetails.contributors[this.absoluteIndex(i)].penaltyAmount !== Number(penalty.value)
      ) {
        this.modified--;
      }
      penalty.disable();
      (this.branchListValue as FormArray).controls[this.absoluteIndex(i)].get('newPenalty').setValue(0);
      this.excluded++;
      if (this.transactionDetails && this.transactionDetails.contributors[i])
        this.transactionDetails.contributors[this.absoluteIndex(i)].excluded = true;
    }
    if (event === 'false') {
      penalty.enable();
      (this.branchListValue as FormArray).controls[this.absoluteIndex(i)].get('newPenalty').setValue(null);
      this.excluded--;
      if (this.transactionDetails && this.transactionDetails.contributors[i])
        this.transactionDetails.contributors[this.absoluteIndex(i)].excluded = false;
    }
    this.getNewPenalty();
  }
  /**
   * Method to get absolute index
   * @param indexOnPage
   */
  getPenaltyValue() {
    const newPenalty = this.modifyPenaltyForm?.get('newPenalty');
    if (newPenalty.value === null || newPenalty.value === '' || newPenalty.value === '.') {
      this.modifyPenaltyForm?.get('newPenalty').setValue(this.transactionDetails?.penaltyAmount);
    } else {
      if (Number(newPenalty.value) === 0) {
        // this.modifyPenaltyForm?.get('newPenalty').setValue(this.transactionDetails?.penaltyAmount);
        this.modifyPenaltyForm?.get('newPenalty').setValidators([Validators.required, greaterThanValidator(0)]);
        this.modifyPenaltyForm?.get('newPenalty').updateValueAndValidity();
      } else {
        this.totalNewPenaltyValue = Number(this.modifyPenaltyForm?.get('newPenalty')?.value);
        this.modifyPenaltyForm?.get('newPenalty').setValue(this.totalNewPenaltyValue);
      }
    }
  }
  /***
   * Method to find the absolute index
   */
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }
  /**
   * This method is enables the form control
   * @param formControl
   */
  disableControl(formControl: AbstractControl) {
    if (formControl) {
      formControl.disable();
      formControl.updateValueAndValidity();
    }
  }

  /**
   * This method is enables the form control
   * @param formControl
   */
  enableControl(formControl: AbstractControl) {
    if (formControl) {
      formControl.enable();
      formControl.updateValueAndValidity();
    }
  }
  /**
   * Method to save the penalty amount
   */
  savePenaltyAmount() {
    if (
      ((this.isSimisFlag || this.isViolatingProvision) && this.modifyPenaltyForm.valid) ||
      (!(this.isSimisFlag || this.isViolatingProvision) && this.modifyPenaltyForm.valid && this.branchListValue.valid)
    ) {
      if (this.isSimisFlag || this.isViolatingProvision) this.getPenaltyValue();
      else this.getNewPenalty();
      const modifyReason = this.modifyPenaltyForm.get('modifyReason').value;
      const comments = this.modifyPenaltyForm.get('comments').value;
      this.submit.emit({ amount: this.totalNewPenaltyValue, reason: modifyReason, comments: comments });
    } else {
      this.errorFlag.emit();
      markFormGroupTouched(this.modifyPenaltyForm);
    }
  }
  /**
   * Method to trigger the cancel details event
   */
  cancelPenaltyDetails() {
    this.cancel.emit();
  }
  /**
   * Method to seelct modify reason
   */
  selectReasonForModify(value) {
    if (value === ViolationsEnum.OTHER_REASON) {
      this.showComments = true;
      this.modifyPenaltyForm.get('comments').setValidators(Validators.required);
      this.modifyPenaltyForm.get('comments').updateValueAndValidity();
    } else {
      this.modifyPenaltyForm.get('comments').setValue(null);
      this.modifyPenaltyForm.get('comments').clearValidators();
      this.modifyPenaltyForm.get('comments').updateValueAndValidity();
      this.showComments = false;
    }
  }
  /**
   * Method to select the corresponding page
   * @param page
   */
  selectPage(page: number) {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }
  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  isSinRequired(identityArray: Array<CommonIdentity>) {
    const type = ['NIN', 'IQAMA', 'GCCID'];
    let sinFlag = false;
    if (identityArray.length > 0) {
      for (const item of identityArray) {
        sinFlag = type.includes(item.idType);
        if (sinFlag === true) break;
      }
      if (sinFlag) return 1;
      else return 0;
    } else return 0;
  }
}
