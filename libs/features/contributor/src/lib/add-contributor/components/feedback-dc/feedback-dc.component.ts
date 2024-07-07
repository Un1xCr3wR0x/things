/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ApplicationTypeToken, BilingualText, CalendarTypeEnum, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EngagementDetails, EngagementPeriod } from '../../../shared';
import * as moment from 'moment';

/**
 * Component for showing the feedback
 *
 * @export
 * @class FeedbackDcComponent *
 * @implements {OnInit}
 */
@Component({
  selector: 'cnt-feedback-dc',
  templateUrl: './feedback-dc.component.html',
  styleUrls: ['./feedback-dc.component.scss']
})
export class FeedbackDcComponent implements OnChanges {
  /**
   * Input variables
   */
  @Input() messageToDisplay: string = null;
  @Input() engagementDetails: EngagementDetails;
  @Input() hideAddContributor: boolean = false;
  @Input() ppaEstablishment: boolean= false;

  /**
   * Output variables
   */
  @Output() resetToFirst: EventEmitter<null> = new EventEmitter();
  /**
   * Local variables
   */
  selectedLang: string;
  engagementPeriod: EngagementPeriod[];
  typeGregorian = CalendarTypeEnum.GREGORIAN;
  typeHijira = CalendarTypeEnum.HIJRI;
  showPPAAnnuity: boolean
  showPensionReform: boolean
  /**
   * This method is used to initialise the component
   * @param language
   * @param appToken
   *
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {
    this.language.subscribe(value => (this.selectedLang = value));
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof FeedbackDcComponent
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.engagementDetails && changes.engagementDetails.currentValue) {
      this.engagementPeriod = this.engagementDetails?.engagementPeriod.sort((a, b) => {
        const dateOne = moment(b.startDate.gregorian);
        const dateTwo = moment(a.startDate.gregorian);
        return dateOne.isAfter(dateTwo) ? 1 : dateOne.isBefore(dateTwo) ? -1 : 0;
      });
      this.engagementPeriod.forEach(item => item.coverageType.forEach(item => {
        if (item.english == 'PPA Annuity') {
          this.showPPAAnnuity = true;
          this.showPensionReform = false;
        }
        if (item.english == 'Pension Reform Annuity') {
          this.showPPAAnnuity = false;
          this.showPensionReform = true;
        }
      }));
    }
  }
  /**
   * This method is used to go to first screen
   * @memberof FeedbackDcComponent
   */
  cntresetToFirstForm() {
    this.resetToFirst.emit();
  }

  /**
   * Check if the coverage has annuity
   * @param coverages
   */
  checkAnnuityCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Annuity') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the coverage has OH
   * @param coverages
   */
  checkOHCoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Occupational Hazard') {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the coverage has UI
   * @param coverages
   */
  checkUICoverage(coverages: BilingualText[]) {
    if (coverages) {
      for (const coverage of coverages) {
        if (coverage.english === 'Unemployment Insurance') {
          return true;
        }
      }
    }

    return false;
  }

    /**
   * Check if the coverage has PPA Annuity
   * @param coverages
   */
    checkPpaCoverage(coverages: BilingualText[]) {
      if (coverages) {
        for (const coverage of coverages) {
          if (coverage.english === 'PPA Annuity') {
            return true;
          }
        }
      }
      return false;
    }

     /**
   * Check if the coverage has PPA Annuity
   * @param coverages
   */
     checkPensionReformCoverage(coverages: BilingualText[]) {
      if (coverages) {
        for (const coverage of coverages) {
          if (coverage.english === 'Pension Reform Annuity') {
            return true;
          }
        }
      }
      return false;
    }
}
