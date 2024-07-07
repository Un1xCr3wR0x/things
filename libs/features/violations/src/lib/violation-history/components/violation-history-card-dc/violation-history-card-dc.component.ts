import { Component, Input, OnInit } from '@angular/core';
import { BilingualText, RoleIdEnum, statusBadgeType } from '@gosi-ui/core';
import { FilterStatusConstants } from '../../../shared/constants';
import { ViolationStatusEnum } from '../../../shared/enums';
import { ViolationHistoryList } from '../../../shared/models';

@Component({
  selector: 'vol-violation-history-card-dc',
  templateUrl: './violation-history-card-dc.component.html',
  styleUrls: ['./violation-history-card-dc.component.scss']
})
export class ViolationHistoryCardDcComponent implements OnInit {
  /** 
  Input variables to get values from transaction-history-sc component
*/
  @Input() transaction: ViolationHistoryList;
  @Input() index = 0;
  @Input() odd: boolean;
  @Input() accessRoles: RoleIdEnum[] = [];

  constructor() {}

  ngOnInit(): void {}

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(status) {
    const violationStatus = this.getStatus(status);
    return statusBadgeType(violationStatus?.english);
  }

  getStatus(status) {
    let item: BilingualText;
    switch (status) {
      case ViolationStatusEnum.VIOLATION_MODIFY:
        item = FilterStatusConstants.STATUS_MODIFIED;
        break;
      case ViolationStatusEnum.VIOLATION_CANCEL:
        item = FilterStatusConstants.STATUS_CANCELLED;
        break;
      case ViolationStatusEnum.APPROVED:
        item = FilterStatusConstants.STATUS_APPROVED;
        break;
      case ViolationStatusEnum.AUTO_APPROVED:
        item = FilterStatusConstants.STATUS_APPROVED;
        break;
    }
    return item;
  }
}
