/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EngagementType } from '../../../../shared/enums';
import { Contributor, EngagementDetails, SearchEngagementResponse } from '../../../../shared/models';

@Component({
  selector: 'cnt-overall-engagement-history-dc',
  templateUrl: './overall-engagement-history-dc.component.html',
  styleUrls: ['./overall-engagement-history-dc.component.scss']
})
export class OverallEngagementHistoryDcComponent {
  /** Constants */
  lang = 'en';
  typeVic = EngagementType.VIC;
  itemsPerPage = 4;
  overallDays: number;
  overallMonths: number;

  /** Input variables */
  @Input() engagementList: EngagementDetails[] = [];
  @Input() contributorData: Contributor;
  @Input() isABSHERregistered: boolean;
  @Input() currentUserRoles: string[];
  @Input() isUnifiedProfile: boolean;
  @Input() isNin: boolean;
  @Input() paginationId: string;
  @Input() currentPage: number;
  @Input() showAbsherTemplate: boolean;
  @Input() individualApp: boolean;
  @Input() isIndividualProfile: boolean;
  @Input() unPaid: boolean;
  @Input() contributionBreakup: SearchEngagementResponse;
  @Input() isPREligible = false;
  /** output event emitters */
  @Output() edit: EventEmitter<object> = new EventEmitter();
  @Output() cancelContract: EventEmitter<object> = new EventEmitter();
  @Output() individualActions: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() fetchContracts: EventEmitter<EngagementDetails> = new EventEmitter();
  @Output() navigateToBillDash: EventEmitter<null> = new EventEmitter();
  /** This method creates a instance of OverallEngagementHistoryDcComponent. */
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}
  ngOnInit(): void {
    this.language.subscribe(lan => (this.lang = lan));
    if (this.contributionBreakup) {
      this.overallDays = this.contributionBreakup.totalRegularContributionDays;
      this.overallMonths =
        this.contributionBreakup.totalRegularContributionMonths + this.contributionBreakup.totalVicContributionMonths;
    }
  }

  /** Method to handle engagement actions. */
  handleEngagementAction(event) {
    this.edit.emit(event);
  }
  /** Method to handle individual engagement actions. */
  handleIndividualEngagementAction(event) {
    this.individualActions.emit(event);
  }
  handleViewContracts(event) {
    this.fetchContracts.emit(event);
  }

  /** Method to handle cancel contract event. */
  handleCancelContract(event) {
    this.cancelContract.emit(event);
  }
  navigateToBillDashboard() {
    this.navigateToBillDash.emit();
  }
}
