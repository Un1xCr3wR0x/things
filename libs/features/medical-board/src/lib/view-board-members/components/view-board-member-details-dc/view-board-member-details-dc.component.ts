/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BilingualText, statusBadgeType, TransactionStatus } from '@gosi-ui/core';
import { DoctorService, MbList} from '../../../shared';

@Component({
  selector: 'mb-view-board-member-details-dc',
  templateUrl: './view-board-member-details-dc.component.html',
  styleUrls: ['./view-board-member-details-dc.component.scss']
})
export class ViewBoardMemberDetailsDcComponent {
  /** 
    Input variables 
  */
  @Input() id: string;
  @Input() currentPage: number;
  @Input() pageSize: number;
  @Input() totalItems: number;
  @Input() filteredMember: MbList[] = [];
  @Input() index = 0;
  @Input() lang;
  transactionStatus = TransactionStatus;

  /**Output variables */
  @Output() memberNavigation: EventEmitter<Object> = new EventEmitter<Object>();
  constructor(
    readonly doctorService: DoctorService
  ) {
  }
  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType() {
    return statusBadgeType(status);
  }
  memberProfile(identificationNo: number, contractType: BilingualText) {
    this.doctorService.setContractType(contractType);
    this.memberNavigation.emit(identificationNo);
  }
}
