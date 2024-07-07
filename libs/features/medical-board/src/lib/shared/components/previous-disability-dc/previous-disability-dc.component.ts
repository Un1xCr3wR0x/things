import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssessmentDetails, DisabilityDetails } from '../../models';

@Component({
  selector: 'mb-previous-disability-dc',
  templateUrl: './previous-disability-dc.component.html',
  styleUrls: ['./previous-disability-dc.component.scss']
})
export class PreviousDisabilityDcComponent implements OnInit {
  @Input() previousDisabilityDetails: DisabilityDetails;

  @Output() onAssessmentIdClicked: EventEmitter<AssessmentDetails> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onAssessmentIdClick(disabilityDetail) {
  this.onAssessmentIdClicked.emit(disabilityDetail);
  }
}
