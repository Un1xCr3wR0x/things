/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Inject,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
  AfterViewChecked
} from '@angular/core';
import { LanguageToken, Contributor, CommonIdentity, getPersonName, checkNull, getIdentityByType } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { AllowanceSummary } from '../../../shared/models/allowance-summary';

@Component({
  selector: 'oh-auditor-allowance-detail-dc',
  templateUrl: './auditor-allowance-detail-dc.component.html',
  styleUrls: ['./auditor-allowance-detail-dc.component.scss']
})
export class AuditorAllowanceDetailDcComponent implements OnInit, OnChanges, AfterViewChecked {
  lang: string;
  modalRef: BsModalRef;
  personNameEnglish: string;
  personNameArabic: string;
  providerName = [];
  providerNameArabic = [];
  providerNameEnglish = [];
  identity: CommonIdentity = new CommonIdentity();

  @Input() contributor: Contributor;
  @Input() id: number;
  @Input() allowanceSummaryDetails: AllowanceSummary;
  @Output() navigate: EventEmitter<null> = new EventEmitter();
  isNull: boolean;
  day: number;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly modalService: BsModalService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.language.subscribe((lan: string) => {
      this.lang = lan;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.allowanceSummaryDetails) {
      this.allowanceSummaryDetails = changes.allowanceSummaryDetails.currentValue;
      this.providerNameArabic = this.getProviderName(this.allowanceSummaryDetails.providerName, 'ar');
      this.providerNameArabic = !this.checkNullName(this.providerNameArabic) ? this.providerNameArabic : null;
      this.providerNameEnglish = this.getProviderName(this.allowanceSummaryDetails.providerName, 'en');
      this.providerNameEnglish = !this.checkNullName(this.providerNameEnglish) ? this.providerNameEnglish : null;
    }
  }

  checkNullName(control) {
    control.forEach(element => {
      if (!element || element === null || element === '' || element === 0) {
        this.isNull = true;
        return true;
      } else {
        this.isNull = false;
        return false;
      }
    });
    return this.isNull;
  }
  getProviderName(providername, locale) {
    this.providerNameArabic = [];
    this.providerNameEnglish = [];
    if (providername) {
      providername.forEach(element => {
        if (locale === 'en') {
          this.providerNameEnglish.push(element.english);
          this.providerName = this.providerNameEnglish;
          return this.providerNameEnglish;
        } else {
          this.providerNameArabic.push(element.arabic);
          this.providerName = this.providerNameArabic;
          return this.providerNameArabic;
        }
      });
    }
    return this.providerName;
  }
  /**
   *
   * @param startDate Get Date Difference
   * @param endDate
   */
  getDateDifference(startDate, endDate) {
    const started = moment(startDate);
    const ended = moment(endDate);
    this.day = ended.diff(started, 'days') + 1;
    if (this.lang === 'en') {
      if (this.day === 1) {
        return this.day + 'Day';
      } else {
        return this.day + 'Days';
      }
    } else {
      return this.day + 'أيام';
    }
  }
  navigateTo(allowanceSummaryDetails) {
    this.navigate.emit(allowanceSummaryDetails);
  }
  //Setting personal Information
  ngAfterViewChecked() {
    if (this.contributor?.person && this.contributor?.person?.name) {
      this.personNameArabic = getPersonName(this.contributor.person.name, 'ar');
      this.personNameArabic = !checkNull(this.personNameArabic) ? this.personNameArabic : null;
      this.personNameEnglish = getPersonName(this.contributor.person.name, 'en');
      this.personNameEnglish = !checkNull(this.personNameEnglish) ? this.personNameEnglish : null;

      /**
       * getting the identity type for the contributor eg:iqama number border number
       */
      this.identity =
        this.contributor.person.identity != null
          ? getIdentityByType(this.contributor.person.identity, this.contributor.person.nationality.english)
          : null;
    }
    this.cdRef.detectChanges();
  }
}
