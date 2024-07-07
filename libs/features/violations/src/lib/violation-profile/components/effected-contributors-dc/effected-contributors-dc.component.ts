/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { statusBadgeType, RoleIdEnum, CommonIdentity } from '@gosi-ui/core';
import { ViolationStatusEnum, ViolationTypeEnum } from '../../../shared/enums';
import { ContributorDetails, ViolationTransaction } from '../../../shared/models';

@Component({
  selector: 'vol-effected-contributors-dc',
  templateUrl: './effected-contributors-dc.component.html',
  styleUrls: ['./effected-contributors-dc.component.scss']
})
export class EffectedContributorsDcComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   * */
  paginationId = 'effected-contributors';
  noOfRecords: number;
  currentPage = 0;
  itemsPerPage = 7;
  pageDetails = {
    currentPage: 1,
    goToPage: '1'
  };
  modified = false;
  violationStatus: string;
  estRegNo: number;
  eachContributor: ContributorDetails;
  violatingProvision = ViolationTypeEnum.RAISE_VIOLATING_PROVISIONS;
  /**
   * Input variables
   */
  @Input() transactionDetails: ViolationTransaction;
  @Input() accessRoles: RoleIdEnum[] = [];

  @Output() showDescriptionPopup = new EventEmitter();
  @Output() hideDescription = new EventEmitter();

  constructor() {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {}
  /**
   * Method to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.transactionDetails) {
      this.transactionDetails = changes.transactionDetails.currentValue;
      this.estRegNo = this.transactionDetails?.establishmentInfo?.registrationNo;
      if (this.transactionDetails && this.transactionDetails.contributors) {
        this.noOfRecords = this.transactionDetails.contributors?.length;
      }
    }
  }
  /**
   * Method to select the corresponding page
   * @param page
   */
  selectPage(page: number): void {
    this.pageDetails.currentPage = this.currentPage = page;
  }
  /**
   * Method to select the badge type
   * @param contributor
   */
  statusBadgeType(contributor: ContributorDetails) {
    if (contributor.excludedInModify || contributor.excluded) status = ViolationStatusEnum.EXCLUDED;
    else status = ViolationStatusEnum.MODIFIED;
    return statusBadgeType(status);
  }

  checkForDescription() {
    let isDesc = 0;
    this.transactionDetails?.contributors.forEach(item => {
      if (item?.engagementInfo[0]?.violationDesc?.english) isDesc = 1;
      else isDesc = 0;
    });
    return isDesc;
  }
  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  isSinNeeded(identity: Array<CommonIdentity>) {
    const idType = ['NIN', 'IQAMA', 'GCCID'];
    let isSin = false;
    if (identity.length > 0) {
      for (const item of identity) {
        isSin = idType.includes(item.idType);
        if (isSin === true) break;
      }
      if (isSin) return 1;
      else return 0;
    } else return 0;
  }
  isDescriptionPopup(templateRef: TemplateRef<HTMLElement>, contributor: ContributorDetails): void {
    this.eachContributor = contributor;
    this.showDescriptionPopup.emit(templateRef);
  }
  hideModal() {
    this.hideDescription.emit();
  }
}
