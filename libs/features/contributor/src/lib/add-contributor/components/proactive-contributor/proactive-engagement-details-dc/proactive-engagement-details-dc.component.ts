/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bindToForm, convertToHijriFormatAPI, LovList, markFormGroupTouched } from '@gosi-ui/core';
import { YesOrNo } from '@gosi-ui/features/contributor';
import * as moment from 'moment';
import { EngagementDetails, EngagementPeriod, HijiriConstant, MaxLengthEnum } from '../../../../shared';
import { EngagementWageAddDcComponent } from '../../engagement-wage-add-dc/engagement-wage-add-dc.component';

@Component({
  selector: 'cnt-proactive-engagement-details-dc',
  templateUrl: './proactive-engagement-details-dc.component.html',
  styleUrls: ['./proactive-engagement-details-dc.component.scss']
})
export class ProactiveEngagementDetailsDcComponent implements OnInit, OnChanges, AfterViewInit {
  /**
   * Input & output event emitters
   */
  @Input() workTypeList: LovList;
  @Input() occupationList: LovList;
  @Input() engagementDetails: EngagementDetails;
  @Input() hijiriDateConst: HijiriConstant;

  /**Output event emitters */
  @Output() previousTab: EventEmitter<null> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() submit: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() showError: EventEmitter<string> = new EventEmitter();

  /**
   * Local variables and initialization
   */
  engagementDetailsForm: FormGroup;
  engagementPeriods: EngagementPeriod[] = [];
  engagementDetailsModel = new EngagementDetails();
  employeeIdMaxLength = MaxLengthEnum.EMPLOYEE_ID;

  /**
   * References to templates and directives
   */

  @ViewChild(EngagementWageAddDcComponent, { static: false })
  engagementWageAddDcComponent: EngagementWageAddDcComponent;

  constructor(public fb: FormBuilder) {}

  ngOnInit() {}

  /**
   * Method to detect input changes
   * @param changes
   */
  //TODO: Handle date binding in the same util method (bindToForm)
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementDetailsForm = this.createEngagementDetailsForm();
      // bind data to engagement details form if workflow
      bindToForm(this.engagementDetailsForm, this.engagementDetails);

      //Set default joining date to engagement details form joining date control
      const defaultJoiningDate = new Date(this.engagementDetails?.joiningDate?.gregorian);
      this.engagementDetailsForm.get('joiningDate')?.get('gregorian')?.setValue(defaultJoiningDate);
      this.engagementDetailsForm.updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    this.engagementWageAddDcComponent.bindToWageEntryForm(this.engagementDetails.engagementPeriod[0]);
  }

  /**
   * Method to create engagement details form
   */
  createEngagementDetailsForm() {
    return this.fb.group({
      joiningDate: this.fb.group({
        gregorian: [''],
        hijiri: ['']
      }),
      workType: this.fb.group({
        english: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ],
        arabic: null
      }),
      companyWorkerNumber: [null, { updateOn: 'blur' }],
      checkBoxFlag: [null, { validators: Validators.requiredTrue }]
    });
  }

  /**
   * Method to add new wage period as engagement history while clicking save wage and occupation button
   * @param wageDetails
   */
  addWagePeriod(wageDetails) {
    wageDetails.canEdit = false;
    wageDetails.contributorAbroad = wageDetails.contributorAbroad.english === YesOrNo.YES ? true : false;
    this.engagementPeriods.push(wageDetails);
    this.engagementPeriods = this.sortEngagementPeriod(this.engagementPeriods);
  }

  /**
   * Method to sort engagement periods (last added period on top)
   * @param wageDetails
   */
  sortEngagementPeriod(wageDetails: EngagementPeriod[]) {
    return wageDetails.sort((a, b) => {
      const dateOne = moment(b?.startDate?.gregorian);
      const dateTwo = moment(a?.startDate?.gregorian);
      return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
    });
  }

  /**
   * Method to remove wage period from wage history table
   * @param rowIndex
   */
  removeWagePeriod(rowIndex: number) {
    this.engagementPeriods.splice(rowIndex, 1);
    this.engagementWageAddDcComponent.isEngagementWageAddFormVisible = true;
    this.engagementWageAddDcComponent.resetWageEntryForm();
    this.engagementWageAddDcComponent.bindToWageEntryForm(this.engagementDetails.engagementPeriod[0]);
  }

  /**
   * Method to save edited row changes on clicking save button
   * @param wageDetails
   */
  updateWagePeriod(wageDetails) {
    this.engagementPeriods.forEach((element, index) => {
      if (index === wageDetails.index) {
        element.canEdit = false;
        element.occupation = wageDetails.wage.occupation;
        element.startDate = wageDetails.wage.startDate;
        element.wage = wageDetails.wage.wage;
      }
    });
  }
  setHirirFormat(){
    this.engagementPeriods.forEach((element) => {
        element.startDate.hijiri = convertToHijriFormatAPI(element.startDate.hijiri);
    });
  }

  /**
   * Method to update proactive contributor engagement details on clicking submit button
   */
  saveEngagementDetails() {
    markFormGroupTouched(this.engagementDetailsForm);
    this.engagementDetailsModel.workType = this.engagementDetailsForm?.get('workType')?.value;
    this.engagementDetailsModel.companyWorkerNumber = this.engagementDetailsForm?.get('companyWorkerNumber')?.value;
    this.engagementDetailsModel.joiningDate.gregorian = this.engagementDetailsForm
      ?.get('joiningDate')
      ?.get('gregorian')?.value;
    this.setHirirFormat();
    this.engagementDetailsModel.engagementPeriod = this.engagementPeriods;
    if (this.engagementDetailsModel?.engagementPeriod?.length === 0) {
      this.showError.emit('CONTRIBUTOR.ERR-ADD-ENGAGEMENT-PERIOD');
    } else if (this.engagementDetailsForm.invalid) {
      this.showError.emit('CORE.ERROR.MANDATORY-FIELDS');
    } else {
      this.submit.emit(this.engagementDetailsModel);
    }
  }

  /**
   * Method to return to the previous tab
   */
  navigateToPreviousTab() {
    this.previousTab.emit();
  }
  /**Method to emit cancel action */
  cancelTransaction(): void {
    this.cancel.emit();
  }
}
