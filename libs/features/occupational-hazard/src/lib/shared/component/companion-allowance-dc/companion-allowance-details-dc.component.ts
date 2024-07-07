/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, SimpleChanges, Inject, OnChanges, HostListener } from '@angular/core';
import { CompanionDetails, CalculationWrapper } from '../../models';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { LanguageToken } from '@gosi-ui/core';

@Component({
  selector: 'oh-companion-allowance-details-dc',
  templateUrl: './companion-allowance-details-dc.component.html',
  styleUrls: ['./companion-allowance-details-dc.component.scss']
})
export class CompanionAllowanceDetailsDcComponent implements OnInit, OnChanges {
  /**
   * Local variables
   */
  daysDifference: number;
  lang = 'en';
  width;
  mobileView: boolean;
  message = false;
  /**
   * Input variables
   */
  @Input() companionDetails: CompanionDetails;
  @Input() calculationWrapper: CalculationWrapper;
  @Input() tabView = false;
  @Input() validatorView = false;

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}
  /**
   * This method if for initialization tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (this.width === 768) {
      this.mobileView = true;
    } else this.mobileView = false;
  }
  /**
   * This method is for detecting changes in input
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.companionDetails && changes.companionDetails) {
      this.companionDetails = changes.companionDetails.currentValue;
    }
    if (changes.companionDetails && changes.validatorView) {
      this.validatorView = changes.validatorView.currentValue;
    }
    if (changes.calculationWrapper && changes.calculationWrapper) {
      this.calculationWrapper = changes.calculationWrapper.currentValue;
    }
    if (changes && changes.tabView) {
      this.tabView = changes.tabView.currentValue;
    }
  }
  /**
   * This method is to get companion conveyance details
   */
  getCompanionAllowanceValues() {
    if (this.companionDetails) {
      const startDate = moment(this.companionDetails.startDate.gregorian);
      const endDate = moment(this.companionDetails.endDate.gregorian);
      if (endDate.diff(startDate, 'days') + 1 > 3) {
        this.message = true;
      }
      if (this.message && this.tabView) {
        return 3;
      } else if (this.calculationWrapper?.benefitStartDate?.hijiri) {
        if (this.companionDetails?.startDate?.hijiri !== this.calculationWrapper?.benefitStartDate?.hijiri) {
          const cmpstartDate = moment(this.calculationWrapper.benefitStartDate.gregorian);
          const cmpendDate = moment(this.companionDetails.endDate.gregorian);
          return cmpendDate.diff(cmpstartDate, 'days') + 1;
        }
      } else {
        return endDate.diff(startDate, 'days') + 1;
      }
    } else return '';
  }
}
