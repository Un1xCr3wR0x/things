import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Alert } from '@gosi-ui/core';

@Component({
  selector: 'bnt-eligibility-warning-popup-dc',
  templateUrl: './eligibility-warning-popup-dc.component.html',
  styleUrls: ['./eligibility-warning-popup-dc.component.scss']
})
export class EligibilityWarningPopupDcComponent implements OnInit {
  @Input() activeAdjustmentsExist;
  @Input() gosiEligibilityWarningMsg: Alert;

  @Output() onModalCloseBtnClicked = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
