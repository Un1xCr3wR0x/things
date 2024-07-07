/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BilingualText,
  LegalEntitiesEnum,
  Lov,
  LovList,
  NationalityTypeEnum,
  greaterThanLessThanValidator
} from '@gosi-ui/core';
import { gradeDetails } from '@gosi-ui/features/contributor/lib/shared/models/jobGradeDetails';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import { ContributorConstants, ManageWageConstants } from '../../../../shared/constants';
import { ContributorWageDetails, ManageWageLookUp } from '../../../../shared/models';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'cnt-multiple-wage-update-dc',
  templateUrl: './multiple-wage-update-dc.component.html',
  styleUrls: ['./multiple-wage-update-dc.component.scss']
})
export class MultipleWageUpdateDcComponent extends WageDetailFormBase implements OnInit, OnChanges {
  @ViewChild('wageDifferenceModal', { static: true }) wageDifferenceModal: TemplateRef<HTMLElement>;
  /**Input variables */
  @Input() occupationList: LovList;
  @Input() updateWageForm: FormGroup;
  @Input() legalEntity: BilingualText;
  @Input() contributorWage: ContributorWageDetails;
  @Input() index: number;
  @Input() lookUpDatas: ManageWageLookUp;
  @Input() isPPA = false;
  
  /** Output variables. */
  @Output() jobClassListChange: EventEmitter<Lov> = new EventEmitter();
  @Output() jobRankListChange: EventEmitter<Lov> = new EventEmitter();

  /**Local variables */
  wageSeparatorLimit = ContributorConstants.WAGE_SEPARATOR_LIMIT;
  modalRef:BsModalRef;
  alreadySavedWage:number;
  updatedTotalWage:number=0;
  newContributoryWage:number=0;
  newTotalWage:number=0;
  wageDiff: number;
  /**
   * This method is to handle initialixation taska
   * @param fb
   */
  constructor(public fb: FormBuilder,public modalService:BsModalService) {
    super(fb);
  }
  /**
   * This method is to handle additional initialization tasks
   */
  ngOnInit(): void {
    this.filterOccupation();
  }

  /**
   * This method is to detect changes in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.occupationList && changes.occupationList.currentValue) {
      this.filterOccupation();
    }
    if (changes.contributorWage && changes.contributorWage.currentValue) {
      this.contributorWage = changes.contributorWage.currentValue;
      this.patchValues();
      this.alreadySavedWage=typeof this.contributorWage?.wageDetails?.wage?.totalWage === 'string' 
      ? parseFloat(this.contributorWage?.wageDetails?.wage?.totalWage) 
      : this.contributorWage?.wageDetails?.wage?.totalWage;
    }
    if (changes.lookUpDatas && changes.lookUpDatas.currentValue) {
      this.lookUpDatas = changes.lookUpDatas.currentValue;
      // this.setDataToForm();
    }
  }
  patchValues() {
    if (
      this.contributorWage &&
      this.updateWageForm &&
      this.lookUpDatas &&
      this.lookUpDatas?.jobClassLov.length > 0 &&
      this.lookUpDatas?.jobRankLov.length > 0 &&
      this.lookUpDatas?.jobGradeLov.length > 0
    ) {
      this.setDataToForm();
    } else {
      setTimeout(() => {
        this.patchValues();
      }, 500);
    }
  }
  setDataToForm() {
    if (this.updateWageForm && this.contributorWage) {
      const jobClass = this.lookUpDatas?.jobClassLov?.find(
        item => item.code === this.contributorWage?.wageDetails?.jobClassCode
      );
      const jobRank = this.lookUpDatas?.jobRankLov?.find(
        item => item.code === this.contributorWage?.wageDetails?.jobRankCode
      );
      const jobGrade = this.lookUpDatas?.jobGradeLov?.find(
        item => item.code === this.contributorWage?.wageDetails?.jobGradeCode
      );
      const setBasicWage = this.lookUpDatas?.jobGradeApiResponse?.find(
        item => parseInt(item?.jobGradeCode) === jobGrade?.code
      );
      this.updateWageForm.get('wageDetails').get('jobClassName').patchValue(jobClass?.value);
      this.updateWageForm.get('wageDetails').get('jobRankName').patchValue(jobRank?.value);
      this.updateWageForm.get('wageDetails').get('jobGradeName').patchValue(jobGrade?.value);
      if (setBasicWage && setBasicWage?.minSalary === setBasicWage?.maxSalary) {
        this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').disable();
      } else {
        this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').enable();
        this.updateWageForm
          ?.get('wageDetails')
          ?.get('wage')
          ?.get('basicWage')
          ?.setValidators([
            Validators.required,
            greaterThanLessThanValidator(setBasicWage?.minSalary, setBasicWage?.maxSalary)
          ]);
      }
      this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage')?.updateValueAndValidity();
      this.updateWageForm.get('wageDetails').updateValueAndValidity();
    }
  }

  /**
   * This methods is filter occupation list for non saudi based on the legal entity
   */
  filterOccupation(): void {
    if (
      this.contributorWage &&
      this.contributorWage.nationality &&
      this.contributorWage.nationality.english &&
      this.contributorWage.nationality.english !== NationalityTypeEnum.SAUDI_NATIONAL &&
      this.occupationList &&
      this.legalEntity &&
      this.legalEntity.english
    ) {
      if (this.legalEntity.english === LegalEntitiesEnum.INDIVIDUAL) {
        this.occupationList = new LovList(this.occupationList.items);
        this.occupationList.items = this.occupationList.items.filter(
          item => ManageWageConstants.EXCLUDED_OCCUPATIONS_NONSAUDI_PRIVATE.indexOf(item.value.english) === -1
        );
      } else {
        this.occupationList = new LovList(this.occupationList.items);
        this.occupationList.items = this.occupationList.items.filter(
          item => ManageWageConstants.EXCLUDED_OCCUPATIONS_NONSAUDI.indexOf(item.value.english) === -1
        );
      }
      this.addingOccupation();
    } else if (
      this.contributorWage &&
      this.contributorWage.nationality &&
      this.contributorWage.nationality.english &&
      this.contributorWage.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL &&
      this.occupationList &&
      this.legalEntity &&
      this.legalEntity.english
    ) {
      this.addingOccupation();
    }
  }
  /**
   * Adding old occupation to new occupation list
   */
  addingOccupation() {
    const oldOccupation = new Lov();
    oldOccupation.value = (this.updateWageForm.get('wageDetails')?.get('occupation') as FormGroup)?.getRawValue();
    oldOccupation.disabled = true;
    if (
      !this.occupationList.items.find(
        item1 =>
          item1.value.arabic === oldOccupation?.value?.arabic && item1.value.english === oldOccupation?.value?.english
      )
    ) {
      oldOccupation.disabled = true;
      this.occupationList.items.push(oldOccupation);
    }
  }
  /**
   * This method is to set 2 decimal places and calculate total wage
   */
  onBlur(): void {
    if(!this.isPPA){
      this.calculateWageDifference(this.updateWageForm.get('wageDetails') as FormGroup);
    }else{
       super.calculateTotalWage(this.updateWageForm.get('wageDetails') as FormGroup);
    }
  }
  // Method to calculate the wage defference for wage confirm popup
  calculateWageDifference(updateWageForm: FormGroup){
     const wageValues = updateWageForm.getRawValue();
    if (wageValues.wage.basicWage) {
      this.newTotalWage += parseFloat(wageValues.wage.basicWage);
      this.newContributoryWage += parseFloat(wageValues.wage.basicWage);
    }
    if (wageValues.wage.commission) {
      this.newTotalWage += parseFloat(wageValues.wage.commission);
      this.newContributoryWage += parseFloat(wageValues.wage.commission);
    }
    if (wageValues.wage.housingBenefit) {
      this.newTotalWage += parseFloat(wageValues.wage.housingBenefit);
      this.newContributoryWage += parseFloat(wageValues.wage.housingBenefit);
    }
    if (wageValues.wage.otherAllowance) {
      this.newTotalWage += parseFloat(wageValues.wage.otherAllowance);
    }
    this.updatedTotalWage=this.newTotalWage
    this.wageDiff = (((this.updatedTotalWage - this.alreadySavedWage) / (this.alreadySavedWage ) )* 100);
    if (this.wageDiff >= 50 || this.wageDiff <= -50){
      this.showModal(this.wageDifferenceModal);
    }
   else {
      this.confirmWageUpdate(false);
    }
  }
  confirmWageUpdate(isModalClick:boolean){
    let updateWageForm= this.updateWageForm.get('wageDetails') as FormGroup;
    updateWageForm.get('wage').patchValue({
      totalWage: this.newTotalWage.toFixed(2)
    });
    updateWageForm.get('wage').patchValue({
      contributoryWage: this.newContributoryWage.toFixed(2)
    });
    this.newContributoryWage=0;
    this.newTotalWage=0;
    if (isModalClick) {
      this.hide();
    }
  }
  resetWage(){
    this.updateWageForm.get('wageDetails').get('wage').reset(this.contributorWage?.wageDetails?.wage);
    this.updateWageForm.get('wageDetails').get('wage').updateValueAndValidity();
    this.newTotalWage=0;
    this.newContributoryWage=0;
    this.hide();
  }
  showModal(templateRef: TemplateRef<HTMLElement>) {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(templateRef, config);
  }

  /** This method is to hide the modal reference. */
  hide() {
    this.modalRef.hide();
  }

  /**
   * This method is used to calculate total wage
   */
  calculateTotalWage(): void {
    super.calculateTotalWage(this.updateWageForm.get('wageDetails') as FormGroup);
  }
  /**Method to select jobClass */
  selectJobClass(data: Lov) {
    this.jobClassListChange.emit(data);
    this.updateWageForm?.get('wageDetails')?.get('jobRankName').reset();
    this.updateWageForm?.get('wageDetails')?.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.lookUpDatas.jobRankLov = [];
    this.lookUpDatas.jobGradeLov = [];
    this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').disable();
  }

  /**Method to select jobRank */
  selectJobRank(data: Lov) {
    this.jobRankListChange.emit(data);
    this.updateWageForm?.get('wageDetails')?.get('jobGradeName').reset();
    this.resetBasicTotalWage();
    this.lookUpDatas.jobGradeLov = [];
    this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').disable();
  }
  resetBasicTotalWage() {
    this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').setValue(parseFloat('0.00').toFixed(2));
    this.updateWageForm?.get('wageDetails')?.get('wage')?.get('totalWage').setValue(parseFloat('0.00').toFixed(2));
  }
  selectJobGrade(event: Lov) {
    this.resetBasicTotalWage();
    const setBasicWage = this.lookUpDatas.jobGradeApiResponse?.find(
      item => parseInt(item?.jobGradeCode) === event?.code
    );
    if (setBasicWage && setBasicWage?.minSalary === setBasicWage?.maxSalary) {
      this.updateWageForm
        ?.get('wageDetails')
        ?.get('wage')
        ?.get('basicWage')
        ?.setValue((setBasicWage?.minSalary).toFixed(2));
      this.updateWageForm
        ?.get('wageDetails')
        ?.get('wage')
        ?.get('totalWage')
        ?.setValue((setBasicWage?.minSalary).toFixed(2));
      this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').disable();
      // this.setBasicWageEnabled(true);
    } else {
      this.haveMinMaxBasicWage(setBasicWage);
    }
  }
  haveMinMaxBasicWage(setBasicWage: gradeDetails) {
    this.updateWageForm
      ?.get('wageDetails')
      ?.get('wage')
      ?.get('basicWage')
      ?.setValue((setBasicWage?.minSalary).toFixed(2));
    this.updateWageForm
      ?.get('wageDetails')
      ?.get('wage')
      ?.get('totalWage')
      ?.setValue((setBasicWage?.minSalary).toFixed(2));
    this.updateWageForm
      ?.get('wageDetails')
      ?.get('wage')
      ?.get('basicWage')
      ?.setValidators([
        Validators.required,
        greaterThanLessThanValidator(setBasicWage?.minSalary, setBasicWage?.maxSalary)
      ]);
    this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage')?.updateValueAndValidity();
    this.updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').enable();
    // this.setBasicWageEnabled(false);
  }
}
