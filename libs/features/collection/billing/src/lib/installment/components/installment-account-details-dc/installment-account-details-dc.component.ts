import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { InstallmentDetails } from '../../../shared/models';

@Component({
  selector: 'blg-installment-account-details-dc',
  templateUrl: './installment-account-details-dc.component.html',
  styleUrls: ['./installment-account-details-dc.component.scss']
})
export class InstallmentAccountDetailsDcComponent implements OnInit, OnChanges {
  constructor() {}

  // Input  variables
  @Input() installmentDetails: InstallmentDetails;

  ngOnInit(): void {}
  // this method is used to get values on input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.installmentDetails?.currentValue) {
      this.installmentDetails = changes?.installmentDetails?.currentValue;
    }
  }
}
