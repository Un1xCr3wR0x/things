import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GosiCalendar } from '@gosi-ui/core';
import { AnnuityResponseDto } from '@gosi-ui/features/payment/lib/shared';
import { Benefits } from '../../models';

@Component({
  selector: 'bnt-cancel-transaction-popup-dc',
  templateUrl: './cancel-transaction-popup-dc.component.html',
  styleUrls: ['./cancel-transaction-popup-dc.component.scss']
})
export class CancelTransactionPopupDcComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() requestDate: GosiCalendar;
  @Input() lateRequest: boolean;
  @Input() newRequestDate: GosiCalendar;

  @Output() close: EventEmitter<null> = new EventEmitter();
  @Output() addNewRequest: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  closeModal() {
    this.close.emit();
  }
  add() {
    this.addNewRequest.emit();
  }
}
