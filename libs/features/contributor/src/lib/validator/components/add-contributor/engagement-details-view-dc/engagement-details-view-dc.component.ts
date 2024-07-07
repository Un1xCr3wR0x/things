/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EngagementDetails, ContributorTypesEnum } from '../../../../shared';
@Component({
  selector: 'cnt-engagement-details-view-dc',
  templateUrl: './engagement-details-view-dc.component.html',
  styleUrls: ['./engagement-details-view-dc.component.scss']
})
export class EngagementDetailsViewDcComponent implements OnChanges {
  /**Input variables */
  @Input() engagement: EngagementDetails;
  @Input() isFCValidator: boolean;
  @Input() canEdit: boolean;
  @Input() conType: string;
  @Input() canEditPenalty: boolean;
  @Input() cntValidatorForm: FormGroup;

  /**Event emiiters */
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter<boolean>();

  /**Local variables */
  employmentDetailsViewForm: FormGroup;
  contTypeEnum = ContributorTypesEnum;

  /**
   * Method to initialize EstablishmentDetailsViewDcComponent
   * @param fb
   */
  constructor(private fb: FormBuilder) {}

  /**
   * Method to detect changes in input variables
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (!this.employmentDetailsViewForm) {
      this.employmentDetailsViewForm = this.createEmplymentDetailsViewForm();
    }

    if (changes.engagement && changes.engagement.currentValue && this.employmentDetailsViewForm) {
      this.employmentDetailsViewForm.get('isContributorActive').setValue(this.engagement.isContributorActive);
      this.employmentDetailsViewForm.get('isContributorActive').disable();
    }

    if (changes.engagement && changes.engagement.currentValue && this.employmentDetailsViewForm) {
      this.employmentDetailsViewForm.get('isContractActive').setValue(this.engagement.skipContract);
      this.employmentDetailsViewForm.get('isContractActive').disable();
    }
  }

  /** Method to create form */
  createEmplymentDetailsViewForm() {
    return this.fb.group({
      isContributorActive: [false, { disabled: true }],
      isContractActive: [false, { disabled: true }]
    });
  }

  // method to emit to edit event
  onEditEstablishmentDetails() {
    this.onEdit.emit();
  }
}
