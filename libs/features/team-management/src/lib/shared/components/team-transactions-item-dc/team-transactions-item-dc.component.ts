/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { statusBadgeType, BPMTask, RequestSort, LanguageToken } from '@gosi-ui/core';
import { TeamTransactionProps } from '../../enums';
import { BPMTaskConstants } from '@gosi-ui/core/lib/constants/bpm-task-list-constants';
import { BehaviorSubject } from 'rxjs';
import { getState } from '../../utils';

@Component({
  selector: 'tm-team-transactions-item-dc',
  templateUrl: './team-transactions-item-dc.component.html',
  styleUrls: ['./team-transactions-item-dc.component.scss']
})
export class TeamTransactionsItemDcComponent implements OnInit, OnChanges {
  /**
   * input variables
   */
  @Input() transaction: BPMTask;
  @Input() control;
  @Input() sortItem: RequestSort;
  @Input() disabled: boolean;
  @Input() isOnHoldMenu: boolean;
  /**
   * output variables
   */
  @Output() transactionSelect = new EventEmitter<Object>();
  @Output() sortEvent = new EventEmitter<Object>();
  @Output() navigate: EventEmitter<BPMTask> = new EventEmitter();

  /**
   * local variables
   */
  txnEnum = TeamTransactionProps;
  sortList = BPMTaskConstants.SORT_FOR_BPM_LIST;
  lang = 'en';
  canNavigate = true;
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe((res: string) => {
      this.lang = res;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.isOnHoldMenu && changes.isOnHoldMenu.currentValue) {
      this.isOnHoldMenu = changes.isOnHoldMenu.currentValue;
    }
  }
  /**
   *
   * @param value method to emit selected transactions
   * @param transaction
   */
  selectTransactions(value, transaction) {
    this.transactionSelect.emit({ value, transaction });
  }

  onCheckboxClick() {
    this.canNavigate = false;
  }

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(transaction) {
    return statusBadgeType(transaction.state);
  }
  /**
   *
   * @param state method to return state
   */
  getState(state) {
    return getState(state);
  }
  /**
   *
   * @param ola method to return ola
   */
  getOLAProgressClass(ola) {
    return ((7 - ola) / 6) * 100 > 50 ? 'bg-danger' : 'bg-info';
  }
  /**
   *
   * @param ola method to return ola progressbar width
   */
  getOLAProgressWidth(ola) {
    return ((7 - ola) / 6) * 100;
  }
  /**
   *
   * @param option method to sort txn
   */
  sortTransactions(option) {
    this.sortEvent.emit(option);
  }
  navigateToTransaction(transaction: BPMTask) {
    if (this.canNavigate) this.navigate.emit(transaction);
    this.canNavigate = true;
  }
}
