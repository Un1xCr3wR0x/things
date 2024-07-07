/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActionTypeEnum } from '../../../../shared';
import { Owner } from '../../../../shared/models/owner';

@Component({
  selector: 'est-transaction-owner-list-dc',
  templateUrl: './transaction-owner-list-dc.component.html',
  styleUrls: ['./transaction-owner-list-dc.component.scss']
})
export class TransactionOwnerListDcComponent implements OnInit, OnChanges {
  @Input() owners: Owner[];
  @Input() currentOwners: Owner[];
  @Input() showModified = false;
  removeRecordAction = ActionTypeEnum.REMOVE;
  modifyRecordAction = ActionTypeEnum.MODIFY;
  totalOwners: number;
  itemsPerPage = 5;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };

  constructor() {}

  ngOnInit(): void {}
  /** Method to detect chnages in input. */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.owners && changes.owners.currentValue) {
      this.totalOwners = changes.owners.currentValue.length;
    }
  }

  dateHasChanged(modifiedOwner: Owner, isStartDate: boolean): boolean {
    const currentOwner = this.currentOwners?.find(owner => owner.ownerId === modifiedOwner.ownerId);
    if (!this.showModified) {
      return false;
    }
    if (isStartDate) {
      return currentOwner?.startDate?.gregorian !== modifiedOwner.startDate?.gregorian;
    } else {
      return currentOwner?.endDate?.gregorian !== modifiedOwner.endDate?.gregorian;
    }
  }

  /**
   *
   * @param page method to trigger the page select event
   */
  selectedPage(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
  }
}
