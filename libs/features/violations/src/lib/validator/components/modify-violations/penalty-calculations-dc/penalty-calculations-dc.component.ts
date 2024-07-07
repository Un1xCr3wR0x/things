import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { statusBadgeType, CommonIdentity } from '@gosi-ui/core';
import { ViolationStatusEnum, ViolationTypeEnum } from '@gosi-ui/features/violations/lib/shared/enums';
import { ChangeViolationContributors, ChangeViolationValidator } from '../../../../shared/models';

@Component({
  selector: 'vol-penalty-calculations-dc',
  templateUrl: './penalty-calculations-dc.component.html',
  styleUrls: ['./penalty-calculations-dc.component.scss']
})
export class PenaltyCalculationsDcComponent implements OnInit, OnChanges {
  //Local variables
  itemPerPage = 7; // Pagination
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  paginationId = 'member-board-list';
  noOfRecords = 0;
  currentPage = 1;

  @Input() violationDetails: ChangeViolationValidator;
  @Input() isSimisFlag: boolean;
  @Input() isValidator1: boolean;
  @Input() isReopenClosingInProgress: boolean = false;
  isViolatingProvision: boolean;

  @Output() editScreen: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.violationDetails) {
      this.violationDetails = changes.violationDetails.currentValue;
      this.isViolatingProvision =
        this.violationDetails?.violationType?.english === ViolationTypeEnum?.VIOLATING_PROVISIONS ? true : false;
      this.violationDetails?.contributors.forEach(item => {
        if (item.currentPenaltyAmount !== item.newPenaltyAmount) {
          item.modified = true;
        } else {
          item.modified = false;
        }
      });
      this.noOfRecords = this.violationDetails?.contributors?.length;
    }
  }
  selectPage(page: number) {
    this.pageDetails.currentPage = this.currentPage = page;
  }

  /**
   * This method is used to style the status badge based on the received status
   */
  statusBadgeType(contributor: ChangeViolationContributors) {
    let status = '';
    if (contributor.isExcluded) {
      status = ViolationStatusEnum.EXCLUDED;
    } else if (contributor.modified) {
      status = ViolationStatusEnum.MODIFIED;
    }
    return statusBadgeType(status);
  }

  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  checkForSIN(identity: Array<CommonIdentity>) {
    const idTypeValue = ['NIN', 'IQAMA', 'GCCID'];
    let isSinCheck = false;
    if (identity.length > 0) {
      for (const item of identity) {
        isSinCheck = idTypeValue.includes(item.idType);
        if (isSinCheck === true) break;
      }
      if (isSinCheck) return 1;
      else return 0;
    } else return 0;
  }
}
