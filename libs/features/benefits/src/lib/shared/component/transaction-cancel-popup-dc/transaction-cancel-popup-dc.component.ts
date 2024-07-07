import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'bnt-transaction-cancel-popup-dc',
  templateUrl: './transaction-cancel-popup-dc.component.html',
  styleUrls: ['./transaction-cancel-popup-dc.component.scss']
})
export class TransactionCancelPopupDcComponent implements OnInit {
  isSmallScreen: boolean;

  @Output() keepDraftEvent = new EventEmitter();
  @Output() discardEvent = new EventEmitter();
  @Output() onCancel = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    const scrWidth = window.innerWidth;
    this.isSmallScreen = scrWidth <= 992 ? true : false;
  }

  discard() {
    this.discardEvent.emit();
  }

  keepDraft() {
    this.keepDraftEvent.emit();
  }

  closeModal() {
    this.onCancel.emit();
  }
}
