import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@gosi-ui/core';
import { ItemizedGovernmentReceiptsResponse } from '../../../shared/models/Itemized-government-receipts-response';

@Component({
  selector: 'blg-government-receipts-receive-payment-dc',
  templateUrl: './government-receipts-receive-payment-dc.component.html',
  styleUrls: ['./government-receipts-receive-payment-dc.component.scss']
})
export class GovernmentReceiptsReceivePaymentDcComponent implements OnInit, OnChanges {
  // Local variables
  isReceived = false;

  @Input() parentForm: FormGroup;
  @Input() allowContinue: boolean = false;
  @Input() receiptDetails: ItemizedGovernmentReceiptsResponse = undefined;

  // output
  @Output() next: EventEmitter<number> = new EventEmitter();
  @Output() continue: EventEmitter<number> = new EventEmitter();
  @Output() cancel: EventEmitter<number> = new EventEmitter();

  constructor(readonly fb: FormBuilder, readonly alertService: AlertService) {}

  ngOnInit(): void {
    if (this.parentForm) {
      this, this.parentForm.addControl('receivePayment', this.createForm());
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.receiptDetails.currentValue) {
      if (
        this.receiptDetails.uploadReceipts[0].status.english === 'In the workflow' ||
        this.receiptDetails.uploadReceipts[0].status.english === 'Completed'
      ) {
        this.isReceived = true;
      } else {
        this.isReceived = false;
      }
    }
  }

  /* create receive payment form */
  createForm() {
    return this.fb.group({
      referenceNo: [null, { validators: Validators.required }],
      registrationNo: [null, { validators: Validators.required }]
    });
  }

  /* Method to get the payment details */
  getPayment() {
    this.next.emit();
  }

  /* Method to submit and continue to receive payment screen */
  submitAndContinue() {
    this.continue.emit();
  }

  /* Method to cancel the pop up */
  cancelPopUp() {
    this.parentForm.get('receivePayment').reset();
    this.cancel.emit();
  }
}
