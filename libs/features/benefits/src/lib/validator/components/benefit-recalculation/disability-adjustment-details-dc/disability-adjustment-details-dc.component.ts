import { Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { lang } from 'moment';
import { formatDate } from '@gosi-ui/core';

@Component({
  selector: 'bnt-disability-adjustment-details-dc',
  templateUrl: './disability-adjustment-details-dc.component.html',
  styleUrls: ['./disability-adjustment-details-dc.component.scss']
})
export class DisabilityAdjustmentDetailsDcComponent implements OnInit, OnChanges {
  @Input() benefitRecalculationDetails;
  @Input() checkForm;
  @Input() disableDirectPayment;
  @Input() lang;

  @Output() onPreviousAdjustmentDetails = new EventEmitter();

  netAdjustmentDetailsForm: FormControl = new FormControl(null, { updateOn: 'blur' });

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}
  onAllowDirectPayment() {}
  onViewPreviousDetails() {
    this.onPreviousAdjustmentDetails.emit();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
