import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'oh-disability-reassessment-instruction-dc',
  templateUrl: './disability-reassessment-instruction-dc.component.html',
  styleUrls: ['./disability-reassessment-instruction-dc.component.scss']
})
export class DisabilityReassessmentInstructionDcComponent implements OnInit {
  @Input() occReassessment: boolean;
  @Output() close = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  hideModal() {
    this.close.emit();
  }
  hi() {
    this.close.emit();
  }
}
