/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { checkIqamaOrBorderOrPassport, CommonIdentity, formatDate } from '@gosi-ui/core';
import {
  BenefitOverviewDetails,
  BenefitStatus,
  BenefitTransactions,
  isLumpsumBenefit,
  MyBenefitRequestsResponse
} from '../../../shared';
import { BenefitGroup, BenefitType } from '../../../shared/enum';
import { PaginationDcComponent } from '@gosi-ui/foundation-theme/src/lib/components';

@Component({
  selector: 'bnt-benefits-requests-tab-dc',
  templateUrl: './benefits-requests-tab-dc.component.html',
  styleUrls: ['./benefits-requests-tab-dc.component.scss']
})
export class BenefitsRequestsTabDcComponent implements OnInit, OnChanges {
  @ViewChild('paginationComponent') paginationDcComponent: PaginationDcComponent;

  paginationId = 'benefitTransactions';
  isAnnuities: boolean;
  isOcc: boolean;
  isUi: boolean;
  BenefitType = BenefitType;
  isDisabilityType: boolean;
  isRetirementType: boolean;
  isSanedType: boolean;
  @Input() myBenefitRequestsResponse: MyBenefitRequestsResponse;
  @Input() benefitOverviewResponse: BenefitOverviewDetails;
  @Input() benefitStatusButtonEvent = {
    onHold: false,
    active: false,
    stopped: false,
    waived: false
  };
  @Input() benefitGroup: string;
  @Input() itemsPerPage: number;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: ''
  };
  @Input() BenefitStatus = BenefitStatus;
  @Input() lang = 'en';
  @Output() selectPageEvent: EventEmitter<number> = new EventEmitter();
  @Output() filterEvent: EventEmitter<BenefitStatus> = new EventEmitter();
  @Output() onBenefitEntryClickEvent: EventEmitter<BenefitTransactions[]> = new EventEmitter();
  readonly Math = Math;
  labelStyle = {
    red: {
      value: { color: 'red', 'font-weight': '600' }
    },
    green: {
      value: { color: 'green', 'font-weight': '600' }
    }
  };
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.benefitOverviewResponse?.currentValue) {
      this.benefitOverviewResponse = changes.benefitOverviewResponse?.currentValue;
      if (
        this.benefitGroup === BenefitGroup.Annuities &&
        this.benefitOverviewResponse?.annuities?.benefitGroup?.english === BenefitGroup.Annuities
      ) {
        this.isAnnuities = true;
      } else if (
        this.benefitGroup === BenefitGroup.Unemployment_Insurance &&
        this.benefitOverviewResponse?.ui?.benefitGroup?.english === BenefitGroup.Unemployment_Insurance
      ) {
        this.isUi = true;
      } else if (
        this.benefitGroup === BenefitGroup.Occupational_Disability &&
        this.benefitOverviewResponse?.occ?.benefitGroup?.english === BenefitGroup.Occupational_Disability
      ) {
        this.isOcc = true;
      }
    }

    if (changes && changes.myBenefitRequestsResponse && this.myBenefitRequestsResponse?.benefits) {
      this.myBenefitRequestsResponse.benefits.forEach(res => {
        res.identifier = checkIqamaOrBorderOrPassport(res?.contributorIdentifier);
        res.isLumpsum = isLumpsumBenefit(res.benefitType.english);
      });
    }
    if (changes && changes.myBenefitRequestsResponse && this.myBenefitRequestsResponse?.benefits) {
      this.myBenefitRequestsResponse.benefits.forEach(res => {
        if (
          res?.benefitType?.english === BenefitType.occPension ||
          res?.benefitType?.english === BenefitType.occLumpsum ||
          res?.benefitType?.english === BenefitType.nonOccPensionBenefitType ||
          res?.benefitType?.english === BenefitType.nonOccLumpsumBenefitType
        ) {
          this.isDisabilityType = true;
          this.isRetirementType = false;
          this.isSanedType = false;
        } else if (
          res?.benefitType?.english === BenefitType.retirementPension ||
          res?.benefitType?.english === BenefitType.retirementLumpsum
        ) {
          this.isRetirementType = true;
          this.isDisabilityType = false;
          this.isSanedType = false;
        } else if (res?.benefitType?.english === BenefitType.ui) {
          this.isSanedType = true;
          this.isDisabilityType = false;
          this.isRetirementType = false;
        }
      });
    }
  }
  filterTransaction(benefitStatus: BenefitStatus) {
    this.filterEvent.emit(benefitStatus);
  }
  onBenefitEntryCLick(eachBenefit: BenefitTransactions[]) {
    this.onBenefitEntryClickEvent.emit(eachBenefit);
  }
  selectPage(page: number) {
    this.selectPageEvent.emit(page);
  }
  resetPage() {
    if (this.paginationDcComponent) this.paginationDcComponent.resetPage();
  }
  getDateFormat(lang) {
    return formatDate(lang);
  }
}
