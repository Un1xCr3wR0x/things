/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BilingualText, Lov } from '@gosi-ui/core';
import { BranchDetails, TransferContributorDetails } from '../../../../shared/models';

@Component({
  selector: 'cnt-transfer-details-dc',
  templateUrl: './transfer-details-dc.component.html'
})
export class TransferDetailsDcComponent implements OnInit, OnChanges {
  /**Input variables */
  @Input() registrationNoList = [];
  @Input() establishmentNameList = [];
  @Input() branchList: BranchDetails[] = [];
  @Input() parentForm: FormGroup = new FormGroup({});
  @Input() transferDetails: TransferContributorDetails;

  establishmentList = [];
  regList = [];
  dlink = false;
  flag = 0;

  /**local variables */
  transferDetailsForm: FormGroup = new FormGroup({});

  /** Method to initialize TransferDetailsDcComponent.*/
  constructor(private fb: FormBuilder) {}

  /** Method to initialize the component. */
  ngOnInit(): void {
    this.transferDetailsForm = this.createTransferForm();
    this.parentForm.addControl('transferForm', this.transferDetailsForm);
  }

  /** Method to detect changes in input. */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.transferDetails && changes.transferDetails.currentValue) {
      this.setTransferDetails();
    }
  }

  /**Method to create transfer form */
  createTransferForm(): FormGroup {
    return this.fb.group({
      establishmentName: this.fb.group({
        english: [null, Validators.required],
        arabic: []
      }),
      registrationNo: [null, Validators.required],
      transferDate: this.fb.group({
        gregorian: [{ value: new Date(), disabled: true }],
        hijiri: []
      })
    });
  }

  /** Method to set transfer details.  */
  setTransferDetails(): void {
    this.transferDetailsForm.get('registrationNo').setValue(this.transferDetails.transferTo);
    this.transferDetailsForm
      .get('transferDate.gregorian')
      .setValue(new Date(this.transferDetails.formSubmissionDate.gregorian));
    this.onEstablishmentChange(this.transferDetails.transferTo);

    if (this.flag === 0) {
      this.dlink = true;
      this.branchList
        .filter(branch => branch.status.english !== 'Closed')
        .map(branch => {
          const newLov = new Lov();
          newLov.sequence = this.branchList.indexOf(branch);
          // console.log("sequence ",newLov.sequence);
          newLov.value.english = branch.name.english ? branch.name.english : branch.name.arabic;
          newLov.value.arabic = branch.name.arabic ? branch.name.arabic : branch.name.english;
          //newLov.disabled =true;
          this.establishmentList.push(newLov);
          this.regList.push(branch.registrationNo);
        });
      const newLov = new Lov();
      newLov.sequence = this.establishmentNameList.length;
      newLov.value.english = this.transferDetails.transferToName.arabic;
      newLov.value.arabic = this.transferDetails.transferToName.arabic;
      newLov.disabled = true;
      this.establishmentList.push(newLov);
      this.establishmentNameList.push(newLov);
      // console.log('transfertoname', this.transferDetails.transferToName.arabic);
      // console.log('establishment ', this.establishmentList);
      this.transferDetailsForm
        .get('establishmentName')
        .setValue(this.establishmentList[this.establishmentList.length - 1].value);
      this.regList.push(this.transferDetails.transferTo);
    }
  }

  /** Method to set establishment.  */
  onEstablishmentChange(value: string | number): void {
    if (value) {
      if (typeof value === 'number') {
        this.branchList.forEach(branch => {
          if (branch.registrationNo === value) {
            this.transferDetailsForm
              .get('establishmentName.english')
              .setValue(branch.name.english ? branch.name.english : branch.name.arabic);
            this.flag = 1;
          }
        });
      } else {
        this.branchList.forEach(branch => {
          if (branch.name.english === value || branch.name.arabic === value)
            this.transferDetailsForm.get('registrationNo').setValue(branch.registrationNo);
        });
      }
    }
  }
}
