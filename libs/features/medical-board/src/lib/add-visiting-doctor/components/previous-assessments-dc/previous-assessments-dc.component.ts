import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { DisabilityDetails } from '../../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'mb-previous-assessments-dc',
  templateUrl: './previous-assessments-dc.component.html',
  styleUrls: ['./previous-assessments-dc.component.scss']
})
export class PreviousAssessmentsDcComponent implements OnInit {
  modalRef: BsModalRef;
  @Output() close = new EventEmitter();
  @Input() previousDisabilityDetails: DisabilityDetails;
  @Output() onAssessmentIdClicked: EventEmitter<DisabilityDetails> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  hideModal() {
    this.close.emit();
  }
  onAssessmentIdClick(disabilityDetail) {
    this.onAssessmentIdClicked.emit(disabilityDetail);
  }
}
