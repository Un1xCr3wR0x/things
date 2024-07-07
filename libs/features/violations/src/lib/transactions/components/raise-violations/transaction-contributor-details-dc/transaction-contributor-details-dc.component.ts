import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonIdentity } from '@gosi-ui/core';
import {
  ViolationConstants,
  ViolationTransaction,
  ViolationTransactionId
} from '@gosi-ui/features/violations/lib/shared';
import moment from 'moment';

@Component({
  selector: 'vol-transaction-contributor-details-dc',
  templateUrl: './transaction-contributor-details-dc.component.html',
  styleUrls: ['./transaction-contributor-details-dc.component.scss']
})
export class TransactionContributorDetailsDcComponent implements OnInit, OnChanges {
  accordionPanel = 1;

  @Input() violationData: ViolationTransaction;
  @Input() isIncorrectWage: boolean;
  @Input() isCancelEngagement: boolean;
  @Input() isIncorrectReason: boolean;
  @Input() isaddEngagement: boolean;
  @Input() isModifyTerminationDate: boolean;
  @Input() isModifyJoiningDate: boolean;
  @Input() isReportViolationTransaction: boolean = false;
  @Input() isWrongBenefits: boolean = false;
  @Input() isViolatingProvision: boolean = false;
  @Input() transactionId: number;
  @Input() isTransactionCompleted: boolean;
  @Input() lang = 'en';
  foValidatorTxn = ViolationTransactionId.FO_VALIDATOR;
  foVcmTxn = ViolationTransactionId.FO_VCM;

  @Output() navigateToContributorProfile: EventEmitter<number> = new EventEmitter();
  @Output() navigateToTrasactionTracking: EventEmitter<object> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.violationData && changes.violationData.currentValue)
      this.violationData = changes.violationData.currentValue;
  }

  /**
   * Method to open the owner accordion
   * @param openEvent
   * @param tabIndex
   */
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
  /**
   * Metyhod to check if sin needed
   * @param identity
   */
  showSinTemplate(identity: Array<CommonIdentity>) {
    const types = ['NIN', 'IQAMA', 'GCCID'];
    let issin = false;
    if (identity.length > 0) {
      for (const item of identity) {
        issin = types.includes(item.idType);
        if (issin === true) break;
      }
      if (issin) return 1;
      else return 0;
    } else return 0;
  }
  /**
   * Method to navigate to establishment profile page
   */
  navigateToProfile(personIndex: number) {
    this.navigateToContributorProfile.emit(personIndex);
  }
  /**
   * Method to get age
   * @param index
   */
  getPersonAge(index: number) {
    return moment(new Date()).diff(moment(this.violationData?.contributors[index]?.dateOfBirth?.gregorian), 'year');
  }
  /**
   * Method to navigate to transaction tracker page
   */
  navigateToTnxTracker(index: number, engIndex: number) {
    this.navigateToTrasactionTracking.emit({ index: index, engIndex: engIndex });
  }
  /**
   * Method to get if contributor exlcuded
   * @param index
   */
  checkForPersonExcluded(contributorId: number) {
    let isContributorExcluded = 0;
    this.violationData.penaltyInfo.forEach(user => {
      user.excludedContributors.forEach(val => {
        if (val.contributorId === contributorId) isContributorExcluded = 1;
      });
    });
    return isContributorExcluded;
  }
  isCommaRequired(contributorId: number, index: number) {
    let isContributorExcluded = 0;
    this.violationData?.penaltyInfo[index]?.excludedContributors.forEach(val => {
      if (val.contributorId === contributorId) isContributorExcluded = 1;
    });
    return isContributorExcluded;
  }

  checkIfLumpsum(benefitType: string) {
    let lumpsum = false;
    if (ViolationConstants.BENEFIT_TYPE_LUMPSUM_LIST.includes(benefitType)) {
      lumpsum = true;
    }
    return lumpsum;
  }
  getIsContributorBenefited(contributorId) {
    let violatedContributor = this.violationData?.penaltyInfo[0]?.violatedContributors.find(
      violatedContributor => violatedContributor.contributorId === contributorId
    );
    // if(violatedContributor ){
    if (violatedContributor && violatedContributor.compensated) {
      return true;
    } else {
      return false;
    }
    // }
  }
}
