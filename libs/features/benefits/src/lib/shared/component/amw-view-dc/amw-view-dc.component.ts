/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  HostListener,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import moment from 'moment-timezone';
import { MonthYearLabel } from '../../enum';
import { CalendarTypeEnum, GosiCalendar, LanguageToken } from '@gosi-ui/core';
import { BenefitDetails,Benefits } from '../../models';
import { BehaviorSubject } from 'rxjs';
import { BenefitType } from '@gosi-ui/features/customer-information/lib/shared/enums/benefits/benefit-type';
import { isEligibleForPensionReform } from '../../utils/pensionReform';
//import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'bnt-amw-view-dc',
  templateUrl: './amw-view-dc.component.html',
  styleUrls: ['./amw-view-dc.component.scss']
})
export class AmwViewDcComponent implements OnInit, OnChanges {
  lang = 'en';
  calendarType = CalendarTypeEnum;
  mobileView: boolean;
  width;
  @Input() benefitDetails: BenefitDetails;
  @Input() eligibleForPensionReform = false;
  @Output() close = new EventEmitter();
  @Input() annuitybenefits: Benefits[] = [];
  @Input() annuityBenefit:Benefits;
  @Input() isLumpsum = false;
  @Input() benefitType: string;
  @Input() isPpaOhDeath: boolean;
  @Input() heirBenefit:boolean;

  wagePeriodHeading = {
    'First Period': 'BENEFITS.CONT-WAGE-FOR-FP',
    'Extra Period for First Period': 'BENEFITS.ADJUSTMENT-AMOUNT-FIRST-EXTRA-PERIOD', // changed Story: 424497
    'Second Period': 'BENEFITS.CONT-WAGE-FOR-SP',
    'Extra Period for Second Period': 'BENEFITS.ADJUSTMENT-AMOUNT-SECOND-EXTRA-PERIOD' // changed Story: 424497
  };

  constructor(@Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.onWindowResize();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    this.onWindowResize();
  }
  // method to get month labels for display
  geMonthForTrans(date: GosiCalendar) {
    let monthLabel = '';
    if (date?.gregorian) {
      monthLabel = Object.values(MonthYearLabel)[moment(date.gregorian).toDate().getMonth()];
    }
    return monthLabel;
  }
  // method to close the modal
  closeModal() {
    this.close.emit();
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.width = window.innerWidth;
    if (this.width <= 414) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }

  isPensionReform(){
    return isEligibleForPensionReform(this.benefitType, this.isLumpsum, this.eligibleForPensionReform)
  }
}
