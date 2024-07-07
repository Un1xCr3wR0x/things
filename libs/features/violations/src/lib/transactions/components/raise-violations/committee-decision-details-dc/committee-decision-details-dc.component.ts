import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import {
  ViolationClassEnum,
  ViolationCommitteEnum,
  ViolationTransaction,
  ViolationValidatorRoles
} from '@gosi-ui/features/violations/lib/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'vol-committee-decision-details-dc',
  templateUrl: './committee-decision-details-dc.component.html',
  styleUrls: ['./committee-decision-details-dc.component.scss']
})
export class CommitteeDecisionDetailsDcComponent implements OnInit, OnChanges {
  penaltyArrayLen: number[] = new Array<number>();
  doNotImposePenalty = ViolationClassEnum.DO_NOT_IMPOSE_PENALTY;
  lang = 'en';

  @Input() violationData: ViolationTransaction;
  @Input() isCancelEngagement: boolean;
  @Input() isIncorrectWage: boolean;
  @Input() isViolatingProvision: boolean;
  @Input() isReportViolationTransaction: boolean;
  @Input() isKashefViolation: boolean;
  @Input() isAutoApprovedViolation: boolean;

  @Output() penalityDetails: EventEmitter<number> = new EventEmitter();
  @Output() excludeContributor: EventEmitter<number> = new EventEmitter();

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.violationData && changes.violationData.currentValue) {
      this.violationData = changes.violationData.currentValue;
      this.violationData.penaltyInfo.forEach(item => {
        this.penaltyArrayLen.push(item.excludedContributors.length);
      });
    }
  }

  getRole(role) {
    if (role.english === ViolationValidatorRoles.COMMITEE_HEAD.toUpperCase()) {
      return ViolationCommitteEnum.VIOLATION_COMMITTEE_HEAD;
    } else {
      return ViolationCommitteEnum.VIOLATION_COMMITTEE_MEMBER;
    }
  }
  /**
   * Show Penality Details
   */
  showPenalityDetails(index: number) {
    this.penalityDetails.emit(index);
  }
  checkAnyExcluded() {
    let isexcluded = 0;
    this.violationData?.penaltyInfo.forEach(item => {
      if (item?.excludedContributors.length > 0) {
        isexcluded = 1;
      }
    });
    return isexcluded;
  }

  /**
   * Show Exclude Contributor Details
   */
  showExcludeContributorDetails() {
    let totalRecords = 0;
    if (this.violationData && this.violationData.contributors) {
      this.violationData.contributors.forEach((value, i) => {
        if (value.excluded) totalRecords++;
      });
    }
    this.excludeContributor.emit(totalRecords);
  }
  isTooltipForJustification(justification) {
    if (justification !== null) {
      if (justification.length > 20) {
        return 1;
      }
      return 0;
    }
  }

  /**
   * Method to get the corresponding validator role
   * @param role
   */
  // getValidatorRole(role) {
  //   if (role === ViolationValidatorRoles.COMMITEE_HEAD) {
  //     return ViolationCommitteEnum.VIOLATION_COMMITTEE_HEAD;
  //   } else {
  //     return ViolationCommitteEnum.VIOLATION_COMMITTEE_MEMBER;
  //   }
  // }
}
