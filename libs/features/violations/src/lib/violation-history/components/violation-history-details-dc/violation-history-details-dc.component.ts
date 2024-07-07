/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { BilingualText, statusBadgeType, RoleIdEnum } from '@gosi-ui/core';
import { ViolationStatusEnum, ViolationClassEnum } from '../../../shared';
import { FilterStatusConstants } from '../../../shared/constants';
import { ViolationHistoryList } from '../../../shared/models';

@Component({
  selector: 'vol-violation-history-details-dc',
  templateUrl: './violation-history-details-dc.component.html',
  styleUrls: ['./violation-history-details-dc.component.scss']
})
export class ViolationHistoryDetailsDcComponent implements OnInit, OnChanges {
  /** 
    Input variables 
  */
  @Input() currentPage: number;
  @Input() filteredHistory: ViolationHistoryList[] = [];
  @Input() id: string;
  @Input() index = 0;
  @Input() pageSize: number;
  @Input() totalItems: number;
  @Input() accessRoles: RoleIdEnum[] = [];

  doNotImposePenalty: String;

  /**Output variables */
  @Output() navigateToHistoryDetails: EventEmitter<Object> = new EventEmitter<Object>();

  constructor() {
    this.doNotImposePenalty = ViolationClassEnum.DO_NOT_IMPOSE_PENALTY;
  }
  /**
   * This method is used to style the status badge based on the received status
   */
  ngOnInit() {}
  /**
   * Mehod to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.totalItems) this.totalItems = changes.totalItems.currentValue;
    if (changes && changes.pageSize) this.pageSize = changes.pageSize.currentValue;
    if (changes && changes.currentPage) this.currentPage = changes.currentPage.currentValue;
  }
  statusBadgeType(status) {
    const violationStatus = this.getStatus(status);
    return statusBadgeType(violationStatus?.english);
  }
  getStatus(status) {
    let item: BilingualText;
    switch (status) {
      case ViolationStatusEnum.APPROVED:
        item = FilterStatusConstants.STATUS_APPROVED;
        break;
      case ViolationStatusEnum.VIOLATION_CANCEL:
        item = FilterStatusConstants.STATUS_CANCELLED;
        break;
      case ViolationStatusEnum.VIOLATION_MODIFY:
        item = FilterStatusConstants.STATUS_MODIFIED;
        break;
      case ViolationStatusEnum.AUTO_APPROVED:
        item = FilterStatusConstants.STATUS_APPROVED;
        break;
    }
    return item;
  }
  navigateToHistory(identificationNo: number) {
    this.navigateToHistoryDetails.emit(identificationNo);
  }
}
