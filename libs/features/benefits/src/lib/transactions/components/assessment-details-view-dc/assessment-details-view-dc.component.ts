import { Component, OnInit, Input } from '@angular/core';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-assessment-details-view-dc',
  templateUrl: './assessment-details-view-dc.component.html',
  styleUrls: ['./assessment-details-view-dc.component.scss']
})
export class AssessmentDetailsViewDcComponent implements OnInit {
  @Input() assessmentDetails;
  @Input() lang = 'en';

  isOccLumpsumBenefit = false;
  isNonOccLumpsumBenefit = !this.isOccLumpsumBenefit;

  constructor() {}

  ngOnInit(): void {}

  getDateFormat(lang) {
    return formatDate(lang);
  }
}
