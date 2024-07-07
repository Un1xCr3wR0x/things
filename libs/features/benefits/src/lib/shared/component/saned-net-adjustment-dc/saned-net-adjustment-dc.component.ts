import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdjustmentCalculationDetails, BenefitDetails, UnemploymentResponseDto } from '../../models';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'bnt-saned-net-adjustment-dc',
  templateUrl: './saned-net-adjustment-dc.component.html',
  styleUrls: ['./saned-net-adjustment-dc.component.scss']
})
export class SanedNetAdjustmentDcComponent implements OnInit {
  @Input() adjustmentCalculationDetails: AdjustmentCalculationDetails;
  @Input() checkForm: FormGroup;
  @Input() disableDirectPayment = false;
  @Input() benefitRequest: UnemploymentResponseDto;
  @Input() benefitDetailsSaned: BenefitDetails;

  @Output() onPreviousAdjustmentsClicked = new EventEmitter();

  readonly Math = Math;
  constructor() {}

  ngOnInit(): void {
    this.checkForm.get('checkBoxFlag').setValue(this.benefitRequest?.directPayment);
  }
  /** Method to view adjustment details */
  viewRecalculateAdjustmentDetails() {
    this.onPreviousAdjustmentsClicked.emit();
  }
}
