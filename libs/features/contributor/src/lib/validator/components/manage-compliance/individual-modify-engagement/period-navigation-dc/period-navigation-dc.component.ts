/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarService, LanguageToken, LookupService } from '@gosi-ui/core';
import { MonthYearLabel } from '@gosi-ui/features/contributor/lib/shared';
import { EngagementPeriod } from '@gosi-ui/features/contributor/lib/shared/models';
import moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cnt-period-navigation-dc',
  templateUrl: './period-navigation-dc.component.html',
  styleUrls: ['./period-navigation-dc.component.scss']
})
export class PeriodNavigationDcComponent implements OnInit, OnChanges {
  /* Local variables */
  width: number;
  periodList = [];
  count = 0;
  next = 3;
  prev = 0;
  rightDisable = false;
  leftDisable = false;
  activeIndex: number;
  lang = 'en';
  primaryIndices = [0, 1, 2];
  newIndex: number;

  /* Input variables */
  @Input() periods: EngagementPeriod[];
  @Input() activeStartDate: Date;
  @Input() disableCalendar = false;
  @Input() checkPrivate: boolean;

  /* Output variables */
  @Output() select: EventEmitter<number> = new EventEmitter();

  /**
   * Method to create an instance of PeriodNavigationDcComponent.
   * @param language language token
   */
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly calendarService: CalendarService,
    readonly lookupService: LookupService
  ) {}

  /** Method to initialize the component. */
  ngOnInit() {
    this.language.subscribe(lang => {
      this.lang = lang;
      const element = document.getElementById(String(this.activeIndex));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        if (this.activeIndex <= 2) this.leftDisable = true;
        else {
          //If current element is 0 - 2, previous element is always 0
          this.prev = Number(element.id) > 2 ? Number(element.id) - 2 : 0;
          this.leftDisable = false;
        }

        if (this.activeIndex === this.count - 1) this.rightDisable = true;
        else {
          //If current element is 0 - 2, next elemet is always 3
          this.next = Number(element.id) <= 2 ? 3 : Number(element.id) + 1;
          this.rightDisable = false;
        }
      }
    });
  }

  /**
   * Method to handle changes to input.
   * @param changes changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.periods && changes.periods.currentValue) {
      if (this.count !== 0 && this.count !== this.periods.length) this.activeIndex = this.periods.length - 1;
      {
        if (this.checkPrivate) {
          this.periods.forEach(period => {
            this.lookupService.getHijriDate(period.startDate.gregorian).subscribe(res => {
              period.startDate.hijiri = res.hijiri;
              if (period.endDate == null && this.periods.length == 1) {
                this.setPeriodlist();
              }
            });
            if (period.endDate) {
              this.lookupService.getHijriDate(period.endDate.gregorian).subscribe(res => {
                period.endDate.hijiri = res.hijiri;
                if (this.periods.length == 1) {
                  this.setPeriodlist();
                } else if (period.endDate.gregorian == this.periods[this.periods.length - 1].endDate.gregorian) {
                  this.setPeriodlist();
                  this.onActiveStartDateChange();
                }
              });
            }
          });
        } else {
          this.setPeriodlist();
        }
      }
    }
    if (changes.activeStartDate && changes.activeStartDate.currentValue) {
      this.newIndex = this.identifyIndexOfPeriod();
      //Timeout is used here because if there is decrease or increase in periods,
      //the period to be scrolled will be available in DOM only after the given time out.
      //The element to be scrolled will be undefined otherwise.
      setTimeout(() => {
        if (
          this.activeStartDate &&
          !moment(this.activeStartDate).isSame(
            this.periods[this.count - this.activeIndex - 1]?.startDate?.gregorian,
            'day'
          )
        ) {
          this.scrollToPeriod(this.newIndex, true);
        } else this.scrollToPeriod(this.newIndex, false);
      }, 100);
    }
  }

  /** Method to scroll content towards right. */
  scrollPeriodRight(): void {
    if (this.leftDisable) {
      this.leftDisable = false;
    }
    if (this.next <= this.count) {
      const element = document.getElementById(String(this.next));
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      this.next = ++this.next;
      this.prev = this.next - 3;

      if (this.next === this.count) {
        this.rightDisable = true;
      } else {
        this.rightDisable = false;
      }
    }
  }

  /** Method to scroll content towards left. */
  scrollPeriodLeft(): void {
    if (this.rightDisable) {
      this.rightDisable = false;
    }
    if (this.prev !== 0) {
      this.prev = --this.prev;
      this.next = this.prev + 3;
      const element = document.getElementById(String(this.prev));
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

      if (this.prev === 0) {
        this.leftDisable = true;
      } else {
        this.leftDisable = false;
      }
    }
  }

  /** Method to create period list for viewing. */
  setPeriodlist() {
    this.count = this.periods.length;
    this.width = this.count === 1 ? 100 : this.count === 2 ? 50 : 34;
    if (this.count <= 3) {
      this.leftDisable = true;
      this.rightDisable = true;
    }
    this.periodList = [];
    this.activeIndex =
      this.activeIndex !== undefined
        ? this.activeIndex === this.count
          ? this.count - 1
          : this.activeIndex
        : this.count - 1;
    this.periods.forEach((element, index) => {
      const period = this.createPeriodData(element, index);
      this.periodList.push(period);
    });
    this.periodList.reverse();
  }

  /**
   * Method to create period
   * @param period period
   * @param index index
   */
  createPeriodData(period: EngagementPeriod, index: number) {
    return {
      currentSelection: index === this.count - this.activeIndex - 1,
      isNewPeriod: period.isSplit,
      isParentPeriod: this.findParentPeriod(index, period.id),
      startMonthLabel: Object.values(MonthYearLabel)[moment(period.startDate.gregorian).toDate().getMonth()],
      endMonthLabel: period.endDate
        ? Object.values(MonthYearLabel)[moment(period.endDate.gregorian).toDate().getMonth()]
        : 'CONTRIBUTOR.ONWARDS',
      startYear: moment(period.startDate.gregorian).toDate().getFullYear(),
      endYear: period.endDate ? moment(period.endDate.gregorian).toDate().getFullYear() : null,
      startYears: period.startDate,
      endYears: period.endDate
    };
  }

  /**
   * Method to handle period selection in grid.
   * @param index index
   * @param periodId periodId
   */
  findParentPeriod(index: number, currentPeriod: number) {
    if (this.periods[index + 1] && this.periods[index].id === this.periods[index + 1].id) return false;
    else if (this.periods[index - 1] && this.periods[index - 1].id === currentPeriod) return true;
  }

  /**
   * Method to handle period selection in grid.
   * @param index index
   */
  onPeriodSelect(index: number) {
    this.periodList[this.activeIndex].currentSelection = false;
    this.periodList[index].currentSelection = true;
    this.activeIndex = index;
    this.select.emit(this.count - this.activeIndex - 1);
  }

  /** Method to identify the index based on active start date. */
  identifyIndexOfPeriod(): number {
    let index = 0;
    this.periods.forEach((period, i) => {
      if (moment(period.startDate.gregorian).isSame(this.activeStartDate, 'day')) {
        index = this.count - i - 1;
      }
    });
    return index;
  }

  /**
   * Method to scroll to a specific period and re-calculate boundaries.
   * The element will be scrolled to last viewable position.
   * @param index index to be scrolled
   * @param canScroll scroll flag
   */
  scrollToPeriod(index: number, canScroll: boolean) {
    const element = document.getElementById(String(index));
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: canScroll ? 'end' : 'nearest' });
    this.periodList[this.activeIndex].currentSelection = false;
    this.periodList[this.newIndex].currentSelection = true;
    this.activeIndex = index;
    if (this.primaryIndices.includes(index)) {
      this.prev = 0;
      this.leftDisable = true;
      if (this.count > 3) {
        this.next = 3;
        this.rightDisable = false;
      } else {
        this.rightDisable = true;
        this.next = this.count;
      }
    } else {
      this.prev = index - 2;
      this.next = index + 1;
      if (this.prev !== 0) this.leftDisable = false;
      else this.leftDisable = true;
      if (this.next === this.count) this.rightDisable = true;
      else this.rightDisable = false;
    }
  }

  onActiveStartDateChange() {
    this.newIndex = this.identifyIndexOfPeriod();
    //Timeout is used here because if there is decrease or increase in periods,
    //the period to be scrolled will be available in DOM only after the given time out.
    //The element to be scrolled will be undefined otherwise.
    setTimeout(() => {
      if (
        this.activeStartDate &&
        !moment(this.activeStartDate).isSame(this.periods[this.count - this.activeIndex - 1].startDate.gregorian, 'day')
      ) {
        this.scrollToPeriod(this.newIndex, true);
      } else this.scrollToPeriod(this.newIndex, false);
    }, 100);
  }
}
