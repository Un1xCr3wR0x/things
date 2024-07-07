import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContributorTypesEnum, EngagementDetails } from '../../../shared';

@Component({
  selector: 'cnt-engagement-view-details-dc',
  templateUrl: './engagement-view-details-dc.component.html',
  styleUrls: ['./engagement-view-details-dc.component.scss']
})
export class EngagementViewDetailsDcComponent implements OnChanges {
  /**Input variables */
  @Input() engagement: EngagementDetails;
  @Input() conType: string;

  contTypeEnum = ContributorTypesEnum;

  /**Local variables */
  employmentDetailsViewForm: FormGroup;

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
  }

  /** Method to create form */
  createEmplymentDetailsViewForm() {
    return this.fb.group({
      isContributorActive: [false, { disabled: true }]
    });
  }
}
