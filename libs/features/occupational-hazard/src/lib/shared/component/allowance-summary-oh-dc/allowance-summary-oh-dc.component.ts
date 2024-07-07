/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { AllowanceAuditSummary } from '../../../shared/models/allowance-audit-summary';
import { AllowanceAuditSummaryOh } from '../../models/allowance-audit-summary-oh';

@Component({
  selector: 'oh-allowance-summary-oh-dc',
  templateUrl: './allowance-summary-oh-dc.component.html',
  styleUrls: ['./allowance-summary-oh-dc.component.scss']
})
export class AllowanceSummaryOhDcComponent implements OnInit, OnChanges {
  @Input() auditSummary: AllowanceAuditSummary;
  @Input() auditSummaryOh: AllowanceAuditSummaryOh;
  @Input() isPrevious = false;

  lang = 'en';
  day: number;
  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(language => (this.lang = language));
  }
  /**
   *
   * @param changes Capturing input on changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.auditSummary) {
      this.auditSummary = changes.auditSummary.currentValue;
    }
    if (changes && changes.auditSummaryOh) {
      this.auditSummaryOh = changes.auditSummaryOh.currentValue;
    }
  }
  /**
   *
   * @param startDate Get Date Difference
   * @param endDate
   */
  findDateDifferenec(startDate, endDate) {
    const started = moment(startDate);
    const ended = moment(endDate);
    this.day = ended.diff(started, 'days') + 1;
    if (this.lang === 'en') {
      if (this.day === 1) {
        return this.day + ' ' + 'Day';
      } else {
        return this.day + ' ' + 'Days';
      }
    } else {
      return this.day + ' ' + 'أيام';
    }
  }
  /**
   *
   * @param number Get days
   */
  getDays(days: number) {
    if (this.lang === 'en') {
      if (days === 1) {
        return days + ' ' + 'Day';
      } else {
        return days + ' ' + 'Days';
      }
    } else {
      return days + ' ' + 'أيام';
    }
  }
  /**
   * retrun Distance Travelled
   */
  getDistance(distance: number) {
    if (this.lang === 'en') {
      return distance + ' ' + 'KM';
    } else {
      return distance + ' ' + 'كم';
    }
  }
  /**
   *
   * @param visits Get visitss
   */
  getVisits(visits: number) {
    if (this.lang === 'en') {
      if (visits === 1) {
        return visits + ' ' + 'Visit';
      } else {
        return visits + ' ' + 'Visits';
      }
    } else {
      return visits + ' ' + 'الزيارات';
    }
  }
  /**
   * Return total amount
   */
  getAmount(amount: number) {
    if (this.lang === 'en') {
      return amount + ' ' + 'SAR';
    } else {
      return amount + ' ' + 'ر.س';
    }
  }
}
