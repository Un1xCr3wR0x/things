import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { AdjustmentTypeDetails, AdjustmentWageDetails, AdjustmentTotal } from '../../../../shared/models';

@Component({
  selector: 'blg-adjustment-breakup-dc',
  templateUrl: './adjustment-breakup-dc.component.html',
  styleUrls: ['./adjustment-breakup-dc.component.scss']
})
export class AdjustmentBreakupDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  adjustmentValue = 0;
  totalOHContribution = 0;
  totalOHContributionCredit = 0;
  totalUIContributionCredit = 0;
  totalAnnuityContributionCredit = 0;
  totalOHPenaltyCredit = 0;
  totalUIPenaltyCredit = 0;
  totalAnnuityPenaltyCredit = 0;
  OthersCredit = 0;
  totalContributionandPenaltyCredit = 0;
  totalOHContributionDebit = 0;
  totalUIContributionDebit = 0;
  totalAnnuityContributionDebit = 0;
  totalOHPenaltyDebit = 0;
  totalUIPenaltyDebit = 0;
  totalAnnuityPenaltyDebit = 0;
  OthersDebit = 0;
  paginationId = 'adjustmentBreakup';
  itemsPerPage = 10;
  currentPage = 1;
  totalRecords_01 = 0;
  totalRecords_02 = 0;
  totalRecords_011 = 0;
  totalRecords_034 = 0;
  lang = 'en';
  isdisbled = false;
  totalContributionandPenaltyDebit = 0;
  backdatedpageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  backdatedTerminationDetails = {
    currentPage: 1,
    goToPage: 1
  };
  wagepageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  //Input variables
  @Input() adjustmentDetails_s2: AdjustmentTypeDetails[];
  @Input() adjustmentDetails_s001: AdjustmentWageDetails[];
  @Input() adjustmentDetails_s002: AdjustmentWageDetails[];
  @Input() adjustmentDetails_s034: AdjustmentWageDetails[];
  @Input() adjustmentDetails_s011: AdjustmentWageDetails[];
  @Input() adjustmentTotal: AdjustmentTotal[];
  /**
   *
   * @param language
   */
  constructor(@Inject(LanguageToken) private language: BehaviorSubject<string>) {}
  /**
   * Method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.isdisbled = true;
  }
  /**
   * MEthod to detect changes in input property
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.adjustmentTotal) {
      this.adjustmentTotal = changes.adjustmentTotal.currentValue;
      if (this.adjustmentTotal) {
        this.totalOHContributionCredit = this.totalOHContributionDebit = this.totalAnnuityContributionCredit = this.totalOHPenaltyCredit = this.totalUIPenaltyCredit = this.totalAnnuityPenaltyCredit = this.OthersCredit = this.totalContributionandPenaltyCredit = 0;
        this.totalOHContributionDebit = this.totalUIContributionDebit = this.totalAnnuityContributionDebit = this.totalOHPenaltyDebit = this.totalUIPenaltyDebit = this.totalAnnuityPenaltyDebit = this.OthersDebit = this.totalContributionandPenaltyDebit = 0;
        this.adjustmentTotal.forEach(adjustment => {
          if (adjustment) {
            if (adjustment.IND === 'CREDIT') {
              this.totalOHContributionCredit += adjustment.TotalOHContribution;
              this.totalUIContributionCredit += adjustment.TotalUIContribution;
              this.totalAnnuityContributionCredit += adjustment.TotalAnnuityContribution;
              this.totalOHPenaltyCredit += adjustment.TotalOHPenalty;
              this.totalUIPenaltyCredit += adjustment.TotalUIPenalty;
              this.totalAnnuityPenaltyCredit += adjustment.TotalAnnuityPenalty;
              this.OthersCredit += adjustment.Others;
              this.totalContributionandPenaltyCredit += adjustment.TotalContributionandPenalty;
            } else if (adjustment.IND === 'DEBIT') {
              this.totalOHContributionDebit += adjustment.TotalOHContribution;
              this.totalUIContributionDebit += adjustment.TotalUIContribution;
              this.totalAnnuityContributionDebit += adjustment.TotalAnnuityContribution;
              this.totalOHPenaltyDebit += adjustment.TotalOHPenalty;
              this.totalUIPenaltyDebit += adjustment.TotalUIPenalty;
              this.totalAnnuityPenaltyDebit += adjustment.TotalAnnuityPenalty;
              this.OthersDebit += adjustment.Others;
              this.totalContributionandPenaltyDebit += adjustment.TotalContributionandPenalty;
            }
          }
        });
      }
    }
    if (changes && changes.adjustmentDetails_s2) {
      this.adjustmentDetails_s2 = changes.adjustmentDetails_s2.currentValue;
    }
    if (changes && changes.adjustmentDetails_s001) {
      this.adjustmentDetails_s001 = changes.adjustmentDetails_s001.currentValue;
      this.totalRecords_01 = this.adjustmentDetails_s001?.length;
    }
    if (changes && changes.adjustmentDetails_s002) {
      this.adjustmentDetails_s002 = changes.adjustmentDetails_s002.currentValue;
      this.totalRecords_02 = this.adjustmentDetails_s002?.length;
    }
    if (changes && changes.adjustmentDetails_s034) {
      this.adjustmentDetails_s034 = changes.adjustmentDetails_s034.currentValue;
      this.totalRecords_034 = this.adjustmentDetails_s034?.length;
    }
    if (changes && changes.adjustmentDetails_s011) {
      this.adjustmentDetails_s011 = changes.adjustmentDetails_s011.currentValue;
      this.totalRecords_011 = this.adjustmentDetails_s011?.length;
    }
  }
  /**
   * MEthod to select wage change page
   * @param page
   */
  selectWagePage(page: number) {
    this.wagepageDetails.currentPage = page;
  }
  /**
   * MEthod to select backdated joining page
   * @param page
   */
  selectBackdatedPage(page: number) {
    this.backdatedpageDetails.currentPage = page;
  }
  /**
   * MEthod to select backdated termination page
   * @param page
   */
  selectTerminationPage(page: number) {
    this.backdatedTerminationDetails.currentPage = page;
  }
}
