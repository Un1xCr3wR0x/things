/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, EventEmitter, Output, SimpleChanges, Inject } from '@angular/core';
import {
  statusBadgeType,
  BPMResponse,
  RequestSort,
  BPMTask,
  LanguageToken,
  SortDirectionEnum,
  Transaction
} from '@gosi-ui/core';
import { FormControl, FormArray } from '@angular/forms';
import { BPMTaskConstants } from '@gosi-ui/core/lib/constants/bpm-task-list-constants';
import { BehaviorSubject } from 'rxjs';
import { getState } from '../../utils';

@Component({
  selector: 'tm-team-transactions-entries-dc',
  templateUrl: './team-transactions-entries-dc.component.html',
  styleUrls: ['./team-transactions-entries-dc.component.scss']
})
export class TeamTransactionsEntriesDcComponent implements OnInit, OnChanges {
  /**
   * input variables
   */
  @Input() transactions: BPMResponse;
  @Input() pageDetails;
  @Input() unViewed: number;
  @Input() sortItem: RequestSort;
  @Input() form: FormArray;
  @Input() selectedTransactions: BPMTask[];
  @Input() isOnHoldMenu: boolean;
  /**
   * local variables
   */
  itemsPerPage = 10;
  currentPage = 1;
  lang = 'en';
  selectAllControl = new FormControl(false);
  sortList = BPMTaskConstants.SORT_FOR_BPM_LIST;
  sortDirection = false;
  canNavigate = true;
  /**
   * output variables
   */
  @Output() pageChanged: EventEmitter<number> = new EventEmitter();
  @Output() sort: EventEmitter<RequestSort> = new EventEmitter();
  @Output() updateSelection: EventEmitter<Object> = new EventEmitter();
  @Output() navigate: EventEmitter<string> = new EventEmitter();
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
  /**
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (changes.selectedTransactions && changes.selectedTransactions.currentValue) {
        this.selectedTransactions = changes.selectedTransactions.currentValue;
      }
      if (changes.isOnHoldMenu && changes.isOnHoldMenu.currentValue) {
        this.isOnHoldMenu = changes.isOnHoldMenu.currentValue;
      }
      if (changes.transactions && changes.transactions.currentValue) {
        this.addCheckboxes();
      }
    }
  }
  /**
   * method to add checkboxes
   */
  addCheckboxes() {
    this.uncheckAll();
    this.selectedTransactions.forEach(st => {
      if (this.transactions) {
        this.transactions.tasks.forEach((t, i) => {
          if (!this.form.at(i).value) {
            this.form.controls[i] = st.taskId === t.taskId ? new FormControl(true) : new FormControl(false);
          }
        });
      }
    });
    this.setSelectAll();
  }
  /**
   * method to uncheck all
   */
  uncheckAll() {
    this.form.clear();
    if (this.transactions) this.transactions.tasks.forEach(() => this.form.push(new FormControl(false)));
    this.setSelectAll();
  }

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(transaction) {
    return statusBadgeType(transaction.state);
  }
  /**
   * method to return state
   * @param state
   */
  getState(state) {
    return getState(state);
  }

  /**
   * Method to trigger the page select event
   * @param page
   */
  selectPage(page: number) {
    this.pageChanged.emit(page);
  }

  /*
   * Method to get sorting list details
   */
  sortTransactions(sortBy) {
    this.sortItem.column = sortBy.column;
    this.sortItem.value = sortBy.value;
    this.sortItem.direction = this.sortDirection ? SortDirectionEnum.ASCENDING : SortDirectionEnum.DESCENDING;
    this.sortDirection = !this.sortDirection;
    this.onSort();
  }

  /**
   * Method to emit sort
   */
  private onSort(): void {
    this.sort.emit(this.sortItem);
  }
  /**
   *
   * @param ola method to get ola
   */
  getOLAProgressClass(ola) {
    return ((7 - ola) / 6) * 100 > 50 ? 'bg-danger' : 'bg-info';
  }
  /**
   *
   * @param ola method to get progressbar width
   */
  getOLAProgressWidth(ola) {
    return ((7 - ola) / 6) * 100;
  }
  /**
   *
   * @param event method to select transaction item
   * @param index
   */
  selectTransactionsItem(event, index) {
    this.selectTransactions(event.value, event.transaction, index);
  }
  /**
   *
   * @param value method to set control
   * @param transaction
   * @param index
   */
  selectTransactions(value, transaction, index) {
    if (value === true) {
      this.form.setControl(index, new FormControl(true));
      this.updateSelection.emit({ type: 'ADD', transaction });
    } else {
      this.form.setControl(index, new FormControl(false));
      this.updateSelection.emit({ type: 'FILTER', transaction });
    }
    this.setSelectAll();
  }
  /**
   * Method to handle select all event
   */
  onSelectAll() {
    const selectAll = this.selectAllControl.value;

    if (selectAll) {
      let remainingTransactionCount = 10 - this.selectedTransactions.length;
      for (let i = 0; i < this.transactions.tasks.length; i++) {
        if (remainingTransactionCount > 0) {
          if (this.form.controls[i].value === true) continue;
          else {
            this.selectTransactions(selectAll, this.transactions.tasks[i], i);
            remainingTransactionCount--;
          }
        }
      }
    } else {
      this.selectedTransactions.forEach((transaction, index) => {
        if (this.transactions.tasks.find(item => item.taskId === transaction.taskId)) {
          this.form.setControl(index, new FormControl(false));
          this.updateSelection.emit({ type: 'FILTER', transaction });
        }
      });
    }
  }
  /**
   * Method to check and set selectall checkbox
   */
  setSelectAll() {
    this.selectAllControl.setValue((this.form.controls.map(item => item.value) as boolean[]).every(item => item));
  }
  /**
   * Method to check whether the checkbox needs to be disabled
   * @param transaction
   */
  checkIsDisabled(transaction: BPMTask): boolean {
    if (this.selectedTransactions.find(item => item.taskId === transaction.taskId)) return false;
    else if (this.selectedTransactions.length >= 10) return true;
    return false;
  }

  navigateToTransaction(transaction: BPMTask) {
    if (this.canNavigate) this.navigate.emit(transaction.referenceNo);
    this.canNavigate = true;
  }

  onCheckboxClick() {
    this.canNavigate = false;
  }
}
