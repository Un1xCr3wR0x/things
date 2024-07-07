/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { TeamTransaction, ActiveReporteeItem } from '../../models';
import { BPMTask, LovList, Lov } from '@gosi-ui/core';

@Component({
  selector: 'tm-unhold-transactions-modal-dc',
  templateUrl: './unhold-transactions-modal-dc.component.html',
  styleUrls: ['./unhold-transactions-modal-dc.component.scss']
})
export class UnholdTransactionsModalDcComponent implements OnInit {
  /**
   * input variables
   */
  @Input() selectedTransactions: BPMTask[] = [];
  @Input() teamMemberList: ActiveReporteeItem[] = [];
  @Input() modalType: string;

  /**
   * output variables
   */
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() action: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  confirmSubmit() {
    this.action.emit(this.modalType);
  }

  /** Method to close the modal. */
  closeModalMethod() {
    this.closeModal.emit();
  }
}
