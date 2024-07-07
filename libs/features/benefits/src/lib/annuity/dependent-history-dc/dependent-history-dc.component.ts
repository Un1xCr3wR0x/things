/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, OnChanges, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import {
  checkIqamaOrBorderOrPassport,
  CommonIdentity,
  LovList,
  GosiCalendar,
  convertToYYYYMMDD,
  IdentityTypeEnum
} from '@gosi-ui/core';
import {
  DependentTransaction,
  DependentHistoryFilter,
  DependentDetails,
  EachHeirDetail,
  DependentsDetails,
  HeirHistoryDetails,
  BenefitEventSource
} from '../../shared';
import { SystemParameter } from '@gosi-ui/features/contributor';

@Component({
  selector: 'bnt-dependent-history-dc',
  templateUrl: './dependent-history-dc.component.html',
  styleUrls: ['./dependent-history-dc.component.scss']
})
export class DependentHistoryDcComponent implements OnInit, OnChanges {
  //Input Variables
  @Input() isHeir = false;
  @Input() lang = 'en';
  @Input() systemRunDate: GosiCalendar;
  @Input() systemParameter: SystemParameter;
  @Input() dependentHistory: DependentTransaction[];
  @Input() dependentDetails: DependentDetails[];
  @Input() dependentEventsList: LovList;
  @Input() showAmountAndMonth = true;
  @Input() isIndividualApp = false;
  @Input() isLumpsum: boolean;

  @Output() dependentFilterEvent: EventEmitter<DependentHistoryFilter> = new EventEmitter();
  @Output() showBenefitsWagePopup: EventEmitter<EachHeirDetail> = new EventEmitter();
  @Output() showDisabilityPopup: EventEmitter<EachHeirDetail> = new EventEmitter();

  /** Local Variables */
  authorizedPersonId: CommonIdentity | null;
  BenefitEventSource = BenefitEventSource;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.dependentHistory && changes.dependentHistory.currentValue) {
      this.dependentHistory = changes.dependentHistory.currentValue;
      this.dependentHistory?.forEach(res => {
        res?.dependentsDetails?.forEach(item => {
          if (item?.identifier) {
            item.dependentIdentifier = checkIqamaOrBorderOrPassport(item.identifier);
          }
        });
      });
    }
  }

  checkHijiri(date) {
    if (this.systemParameter && date) {
      if (convertToYYYYMMDD(date.toString()) < convertToYYYYMMDD(this.systemParameter.OLD_LAW_DATE.toString())) {
        return true;
      } else {
        return false;
      }
    }
  }
  filterDependentHistory(dependentHistoryFilter: DependentHistoryFilter) {
    this.dependentFilterEvent.emit(dependentHistoryFilter);
  }
  lumpsumCheck(endDate: GosiCalendar) {
    //onwards not required for lumpsum type
    return endDate ? true : this.isLumpsum ? false : true;
  }
  getIdentityLabel(idObj: CommonIdentity) {
    let label = '';
    if (idObj?.idType === IdentityTypeEnum.NIN) {
      label = 'BENEFITS.NIN-ID';
    } else if (idObj?.idType === IdentityTypeEnum.IQAMA) {
      label = 'BENEFITS.IQAMA-NUMBER';
    } else if (idObj?.idType === IdentityTypeEnum.PASSPORT) {
      label = 'BENEFITS.PASSPORT-NO';
    } else if (idObj?.idType === IdentityTypeEnum.NATIONALID) {
      label = 'BENEFITS.GCC-NIN';
    } else if (idObj?.idType === IdentityTypeEnum.BORDER) {
      label = 'BENEFITS.BORDER-NO';
    } else {
      label = 'BENEFITS.NATIONAL-ID';
    }
    return label;
  }
  showBenefitWageDetails(dependentItem: DependentTransaction, position: number) {
    const benefitWageDetail: EachHeirDetail = {
      dateFrom: dependentItem.dateFrom,
      dateTo: dependentItem.dateTo,
      heirDetails: this.convertToDependentDetails(dependentItem.dependentsDetails[position])
    };
    this.showBenefitsWagePopup.emit(benefitWageDetail);
  }
  showDisabilityDetails(dependentItem: DependentTransaction, position: number) {
    const disabiltyDetail: EachHeirDetail = {
      dateFrom: dependentItem.dateFrom,
      dateTo: dependentItem.dateTo,
      heirDetails: this.convertToDependentDetails(dependentItem.dependentsDetails[position])
    };
    this.showDisabilityPopup.emit(disabiltyDetail);
  }
  convertToDependentDetails(dependentDetails: DependentsDetails) {
    // TODO: Refactor and clean up the logic
    const heirDetails = new HeirHistoryDetails();
    for (const key in dependentDetails) {
      if (key !== 'relation') heirDetails[key] = dependentDetails[key];
    }
    heirDetails.relationship = dependentDetails.relation;
    return heirDetails;
  }
}
