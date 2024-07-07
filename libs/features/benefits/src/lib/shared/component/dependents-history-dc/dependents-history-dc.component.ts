/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { checkIqamaOrBorderOrPassport, CommonIdentity, convertToYYYYMMDD, IdentityTypeEnum } from '@gosi-ui/core';
import {
  DependentComponents,
  DependentsDetails,
  DependentTransaction,
  EachHeirDetail,
  HeirHistoryDetails,
  ReCalculationDetails,
  HeirHistory,
  SystemParameter,
  BenefitDetails
} from '../../models';
import { isHeirBenefit } from '../../utils';
import { BenefitEventSource, BenefitType } from '../../enum';

@Component({
  selector: 'bnt-dependents-history-dc',
  templateUrl: './dependents-history-dc.component.html',
  styleUrls: ['./dependents-history-dc.component.scss']
})
export class DependentsHistoryDcComponent implements OnInit, OnChanges {
  // Local Variables
  isHeirBenefit = isHeirBenefit;
  BenefitEventSource = BenefitEventSource;
  history: DependentTransaction[] = [];
  benefitTypes = BenefitType;
  @Input() benefitDetails: BenefitDetails;
  @Input() isAddModifyBenefit = false;
  @Input() isModifyBackdated = false;
  @Input() isAddModifyHeir: boolean;
  @Input() benefitType: string;
  @Input() requestType: string;
  // @Input() dependentHistory: DependentTransaction[];
  @Input() dependentHistory: DependentTransaction[] = [];
  @Input() heirHistory: HeirHistory[] = [];
  @Input() systemParameter: SystemParameter;
  @Input() lang = 'en';
  @Input() benefitPeriodHistory: HeirHistory;
  @Input() dependentComponents: DependentComponents[];
  @Input() reCalculationDetails: ReCalculationDetails[];
  @Input() isIndividualApp = false;
  @Input() oldHistory = false;
  @Output() showBenefitsWagePopup: EventEmitter<EachHeirDetail> = new EventEmitter();
  @Output() showCalcModalEmitter = new EventEmitter();

  readonly Math = Math;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.heirHistory && changes.heirHistory.currentValue) {
      if (this.heirHistory) this.setHistoryDetails(this.heirHistory);
    }
    if (changes && changes.dependentHistory && changes.dependentHistory.currentValue) {
      if (this.dependentHistory) {
        this.history = this.dependentHistory;
        this.setIdentifier();
      }
    }
  }

  checkHijiri(date) {
    if (this.systemParameter) {
      if (convertToYYYYMMDD(date.toString()) < convertToYYYYMMDD(this.systemParameter.OLD_LAW_DATE.toString())) {
        return true;
      } else {
        return false;
      }
    }
  }

  //method to assign heir history values to dependent history Model
  setHistoryDetails(heirHistory: HeirHistory[]) {
    this.history = [];
    heirHistory.forEach(history => {
      const dependentDetails = new DependentTransaction();
      dependentDetails.dateFrom = history?.dateFrom;
      dependentDetails.dateTo = history?.dateTo;
      dependentDetails.statusDate = history?.statusDate;
      dependentDetails.nullified = history?.nullified;
      if (history?.heirHistoryDetails) {
        dependentDetails.dependentDetails = new DependentsDetails();
        dependentDetails.dependentDetails.eligibilityStarted = history?.heirHistoryDetails.benefitStarted;
        dependentDetails.dependentDetails.isOrphan = history?.heirHistoryDetails.isOrphan;
        dependentDetails.dependentDetails.changeDate = history?.heirHistoryDetails?.changeDate;
        dependentDetails.dependentDetails.name = history?.heirHistoryDetails?.name;
        dependentDetails.dependentDetails.relation = history?.heirHistoryDetails?.relationship;
        dependentDetails.dependentDetails.dependentIdentifier = history?.heirHistoryDetails?.identifier
          ? checkIqamaOrBorderOrPassport(history?.heirHistoryDetails?.identifier)
          : null;
        dependentDetails.dependentDetails.amount = history?.heirHistoryDetails?.amount;
        dependentDetails.dependentDetails.heirStatus = history?.heirHistoryDetails?.heirStatus;
        dependentDetails.dependentDetails.otherBenefitAndWage = history?.heirHistoryDetails?.otherBenefitAndWage;
        dependentDetails.dependentDetails.marriageGrantAmount = history?.heirHistoryDetails?.marriageGrantAmount;
        dependentDetails.dependentDetails.deathGrantAmount = history?.heirHistoryDetails?.deathGrantAmount;
        dependentDetails.dependentDetails.dependentEventType = history?.heirHistoryDetails?.eventType;
        dependentDetails.dependentDetails.benefitStarted = history?.heirHistoryDetails?.benefitStarted;
        dependentDetails.dependentDetails.removedEvent = history?.heirHistoryDetails?.removedEvent;
        dependentDetails.dependentDetails.addedEvent = history?.heirHistoryDetails?.addedEvent;
        dependentDetails.dependentDetails.eventSource = history?.heirHistoryDetails?.eventSource;
      }
      history?.heirDetails?.forEach(heirData => {
        const dependentData = new DependentsDetails();
        dependentData.changeDate = heirData?.changeDate;
        dependentData.name = heirData?.name;
        dependentData.isOrphan = heirData?.isOrphan;
        dependentData.relation = heirData?.relationship;
        dependentData.identifier = heirData?.identifier;
        dependentData.dependentIdentifier = heirData?.identifier
          ? checkIqamaOrBorderOrPassport(heirData?.identifier)
          : null;
        dependentData.amount = heirData?.amount;
        dependentData.heirStatus = heirData?.heirStatus;
        dependentData.otherBenefitAndWage = heirData?.otherBenefitAndWage;
        dependentData.marriageGrantAmount = heirData?.marriageGrantAmount;
        dependentData.deathGrantAmount = heirData?.deathGrantAmount;

        // dependentData.dependentEventType = heirData?.eventType; Not in the api currently
        dependentDetails?.dependentsDetails.push(dependentData);
      });
      this.history.push(dependentDetails);
    });
  }

  //setIdentifier for dependent details
  setIdentifier() {
    this.history?.forEach(res => {
      res?.dependentsDetails?.forEach(item => {
        if (item?.identifier) {
          item.dependentIdentifier = checkIqamaOrBorderOrPassport(item.identifier);
        }
      });
    });
  }

  showCalcModal() {
    this.showCalcModalEmitter.emit('historyCalcModal');
  }

  showBenefitWageDetails(dependentItem: DependentTransaction, position: number) {
    const benefitWageDetail: EachHeirDetail = {
      dateFrom: dependentItem.dateFrom,
      dateTo: dependentItem.dateTo,
      heirDetails: this.convertToDependentDetails(dependentItem.dependentsDetails[position])
    };
    this.showBenefitsWagePopup.emit(benefitWageDetail);
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
}
