import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DisabilityDetails } from '../../shared/models/contributor-assessment-request';

@Component({
  selector: 'oh-previous-assessment-modal-dc',
  templateUrl: './previous-assessment-modal-dc.component.html',
  styleUrls: ['./previous-assessment-modal-dc.component.scss']
})
export class PreviousAssessmentModalDcComponent implements OnInit {
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
  onAssessmentIdClick(data:DisabilityDetails) {
    this.onAssessmentIdClicked.emit(data);
  }
}
