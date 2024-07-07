/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lov, LovList } from '@gosi-ui/core';
import {
  TERMINATE_CONTRIBUTOR_LOV_VALUE,
  TRANSFER_CONTRIBUTOR_LOV_VALUE,
  TRANSFER_CONTRIBUTOR_NO_ACTION_LOV_VALUE
} from '../../../shared';

@Component({
  selector: 'est-active-contributor-details-dc',
  templateUrl: './active-contributor-details-dc.component.html',
  styleUrls: ['./active-contributor-details-dc.component.scss']
})
export class ActiveContributorDetailsDcComponent implements OnInit, OnChanges {
  contributorDetailsForm: FormGroup;
  terminateaAllAction = TERMINATE_CONTRIBUTOR_LOV_VALUE.english;
  tranferAllAction = TRANSFER_CONTRIBUTOR_LOV_VALUE.english;
  noContributorAction = TRANSFER_CONTRIBUTOR_NO_ACTION_LOV_VALUE.english;

  @Input() actionsList: LovList[];
  @Input() parentForm: FormGroup;
  @Input() contributorCount: FormGroup;
  @Input() branchEstablsihmentList: Lov[] = [];
  @Input() leaveReasonList: LovList;

  @Output() selectTranferBranch: EventEmitter<number> = new EventEmitter();

  constructor(readonly fb: FormBuilder) {
    this.contributorDetailsForm = this.createContributorDetailsForm();
  }

  ngOnInit(): void {
    if (this.parentForm) {
      this.parentForm.addControl('contributorDetails', this.contributorDetailsForm);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.leaveReasonList?.currentValue?.items?.length > 0) {
      this.contributorDetailsForm
        .get('transferReason')
        ?.get('english')
        .setValue(this.leaveReasonList?.items[0]?.value?.english);
      this.contributorDetailsForm
        .get('transferReason')
        ?.get('arabic')
        .setValue(this.leaveReasonList?.items[0]?.value?.arabic);
      this.contributorDetailsForm
        .get('terminateReason')
        ?.get('english')
        .setValue(this.leaveReasonList?.items[1]?.value?.english);
      this.contributorDetailsForm
        .get('terminateReason')
        ?.get('arabic')
        .setValue(this.leaveReasonList?.items[1]?.value?.arabic);
    }
  }
  /**
   * Method to get the details of selected branch from dropdown
   * @param item
   */
  getEstDetails(item: Lov) {
    this.selectTranferBranch.emit(item?.code);
  }

  /**
   * Method to create the contributor details form
   */
  createContributorDetailsForm() {
    return this.fb.group({
      action: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: null
      }),
      terminateDate: this.fb.group({
        gregorian: [{ value: new Date(), disabled: true }],
        hijiri: []
      }),
      terminateReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      transferDate: this.fb.group({
        gregorian: [{ value: new Date(), disabled: true }],
        hijiri: []
      }),
      transferReason: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      branchEstablishment: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }

  /**
   * method to handle the contibution action change
   */
  actionChange() {
    if (this.contributorDetailsForm.get('action')?.get('english').value === this.tranferAllAction) {
      this.contributorDetailsForm.get('branchEstablishment')?.get('english').setValidators([Validators.required]);
    } else {
      this.contributorDetailsForm.get('branchEstablishment')?.get('english').setValidators(null);
    }
    this.contributorDetailsForm.get('branchEstablishment')?.get('english').updateValueAndValidity();
  }
}
