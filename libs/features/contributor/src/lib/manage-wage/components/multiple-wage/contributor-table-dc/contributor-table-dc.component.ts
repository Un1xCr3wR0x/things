/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LovList, bindToForm } from '@gosi-ui/core';
import { WageDetailFormBase } from '@gosi-ui/foundation/form-fragments';
import {
  ContributorWageDetails,
  ContributorWageDetailsResponse,
  ManageWageLookUp,
  WorkFlowTypeEnum
} from '../../../../shared';
@Component({
  selector: 'cnt-contributor-table-dc',
  templateUrl: './contributor-table-dc.component.html',
  styleUrls: ['./contributor-table-dc.component.scss']
})

/**
 * This method is used to create a table with contributor wage details
 */
export class ContributorTableDcComponent extends WageDetailFormBase implements OnChanges {
  /** Input Variable */
  //TODO: rename to wageDetails
  @Input() contributorWageDetailsResponse: ContributorWageDetailsResponse;
  @Input() occupationList: LovList;
  @Input() parentForm: FormGroup;
  @Input() legalEntity: BilingualText;
  @Input() currentPage: number; //Pagination current page
  @Input() pageSize: number; // Pagination item per page
  @Input() totalSize: number; // Pagination total page
  @Input() id: string; // Pagination for Identificatino during multiple instance. !Important id for pagniation component and paginate Pipe should be same.
  @Input() enableNavigation: boolean;
  @Input() lookUpDatas: ManageWageLookUp[] = new Array<ManageWageLookUp>();
  @Input() isPPA = false;

  WorkFlowTypeEnum = WorkFlowTypeEnum;
  ContributorWageDetail;

  /** Output variables. */
  @Output() navigate: EventEmitter<number> = new EventEmitter();
  @Output() jobClassListChange: EventEmitter<Object> = new EventEmitter();
  @Output() jobRankListChange: EventEmitter<Object> = new EventEmitter();

  /**
   * This method is to initialize ContributorTableDcComponent
   * @param fb
   */
  constructor(public fb: FormBuilder) {
    super(fb);
  }

  /**
   * This method is to detect changes in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contributorWageDetailsResponse && changes.contributorWageDetailsResponse) {
      this.generateFormView();
    }
    if (changes.currentPage) {
      this.currentPage = changes.currentPage.currentValue;
    }
  }

  /**
   * This method is used to generate view for table
   */
  generateFormView(): void {
    let updateWageForm: FormGroup;
    const wageForms: FormArray = this.fb.array([]);
    //TODO: only contributorWageList is taking from contributorWageDetailsResponse. so pass contributorWageList intead as input.
    if (this.contributorWageDetailsResponse.contributors.length > 0) {
      this.contributorWageDetailsResponse.contributors.forEach((cont: ContributorWageDetails) => {
        updateWageForm = this.createUpdateWageForm();
        bindToForm(updateWageForm, cont);
        this.isPPA
          ? updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').disable()
          : updateWageForm?.get('wageDetails')?.get('wage')?.get('basicWage').enable();
        wageForms.push(updateWageForm);
      });
      if (wageForms.length > 0) {
        if (this.parentForm.controls.wageForms) {
          this.parentForm.removeControl('wageForms');
        }
        this.parentForm.addControl('wageForms', wageForms as FormArray);
        this.parentForm.controls.wageForms.markAsPristine();
        this.parentForm.controls.wageForms.markAsUntouched();
      }
    }
  }

  /**
   * Getter method for fetching wage array of forms
   */
  get wageFormArray(): FormArray {
    return this.parentForm.controls.wageForms as FormArray;
  }

  /**
   * This method is to create form to hold value
   */
  createUpdateWageForm(): FormGroup {
    return this.fb.group({
      socialInsuranceNo: [null],
      engagementId: [null],
      wageDetails: super.createWageDetailsForm(this.isPPA)
    });
  }

  /** Method to handle navigation. */
  handleNavigation(sin: number) {
    this.navigate.emit(sin);
  }
  jobClassListChangeForPPA(event, index: number) {
    this.jobClassListChange.emit({ data: event, index: index });
  }
  jobRankListChangeForPPA(event, index: number) {
    this.jobRankListChange.emit({ data: event, index: index });
  }
}
