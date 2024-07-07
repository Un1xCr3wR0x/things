/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TransactionSummary } from '../../models';
import { statusBadge, BilingualText } from '@gosi-ui/core';
import { CategoryEnum, TransactionChannelEnum } from '../../enums';
import { LovListConstants } from '../../constants';

@Component({
  selector: 'ces-previous-transaction-item-dc',
  templateUrl: './previous-transaction-item-dc.component.html',
  styleUrls: ['./previous-transaction-item-dc.component.scss']
})
export class PreviousTransactionItemDcComponent implements OnInit, OnChanges {
  /**
   * input variables
   */
  @Input() transaction: TransactionSummary = null;
  /**
   * output variables
   */
  @Output() navigate: EventEmitter<TransactionSummary> = new EventEmitter();
  /**
   * local variables
   */
  channel = TransactionChannelEnum;
  typeLabel: string;
  subTypeLabel: string;

  constructor() {}

  ngOnInit(): void {}
  /**
   *
   * @param changes This method is used to handle the changes in the input variables
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transaction && changes.transaction.currentValue)
      this.transaction = changes.transaction.currentValue;
    if (this.transaction.category) {
      if (this.transaction.category.english !== CategoryEnum.SUGGESTION) {
        const constantItem = LovListConstants.LABELS.find(
          item => item.value.toLowerCase() === this.transaction.category.english.toLowerCase()
        );
        this.typeLabel = constantItem?.typeLabel;
        this.subTypeLabel = constantItem?.subTypeLabel;
      } else if (this.transaction.category.english === CategoryEnum.SUGGESTION) {
        const constantItem = LovListConstants.LABELS.find(
          item => item.value.toLowerCase() === this.transaction.category.english.toLowerCase()
        );
        this.typeLabel = constantItem?.suggestionTypeLabel;
        this.subTypeLabel = constantItem?.suggestionSubTypeLabel;
      }
    } else if (!this.transaction.category) {
      this.typeLabel = 'TYPE';
      this.subTypeLabel = 'SUB-TYPE';
    }
  }
  /**
   *
   * @param status method to set status
   */
  statusBadgeType(status: BilingualText) {
    return statusBadge(status.english);
  }
  /**
   *
   * @param transaction method to emit navigate event
   */
  onNavigate(transaction: TransactionSummary) {
    this.navigate.emit(transaction);
  }
}
