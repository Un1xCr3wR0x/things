import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DisabilityDetails } from '../../../shared';

@Component({
  selector: 'oh-previous-assessment-dc',
  templateUrl: './previous-assessment-dc.component.html',
  styleUrls: ['./previous-assessment-dc.component.scss']
})
export class PreviousAssessmentDcComponent implements OnInit {
  modalRef: BsModalRef;
  @Output() close = new EventEmitter();
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Output() onAssessmentIdClicked: EventEmitter<DisabilityDetails> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
  }
  hideModal() {
    this.close.emit();
  }
  onAssessmentIdClick(disabilityDetail) {
    this.onAssessmentIdClicked.emit(disabilityDetail);
  }
}
