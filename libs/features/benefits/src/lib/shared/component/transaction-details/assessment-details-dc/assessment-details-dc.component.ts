import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { RecalculationAssessment, AnnuityResponseDto } from '../../../../shared/models';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-assessment-details-dc',
  templateUrl: './assessment-details-dc.component.html',
  styleUrls: ['./assessment-details-dc.component.scss']
})
export class AssessmentDetailsDcComponent implements OnInit {
  @Input() assessmentDetails: RecalculationAssessment;
  @Input() benefitDetails: AnnuityResponseDto;
  @Input() isOcc: Boolean;
  @Input() lang = 'en';

  @Output() onAssessmentIdClicked = new EventEmitter();
  @Output() onInjuryIdClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  /* Method to navigate to transaction */
  onAssessmentIDClick(id) {
    this.onAssessmentIdClicked.emit(id);
  }
  /* Method to navigate to injury details */
  onInjuryIDClick(injuryId) {
    this.onInjuryIdClicked.emit(injuryId);
  }

  onComplicationIDClick() {}

  getDateFormat(lang) {
    return formatDate(lang);
  }
}
