import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BaseComponent, GosiCalendar, endOfDay } from '@gosi-ui/core';
import * as moment from 'moment-timezone';
import { Observable, of } from 'rxjs';
import { TimerLabelList, timeComponents } from './timer-data';

@Component({
  selector: 'gosi-count-down-timer-dc',
  templateUrl: './count-down-timer-dc.component.html',
  styleUrls: ['./count-down-timer-dc.component.scss']
})
export class CountDownTimerDcComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
  timeLeft$: Observable<timeComponents>;
  secLabel = TimerLabelList.TIME_SEC.label;
  minLabel = TimerLabelList.TIME_MIN.label;
  hrsLabel = TimerLabelList.TIME_HOURS.label;
  dayZeroLabel = TimerLabelList.DAY_ZERO.label;
  dayOneLabel = TimerLabelList.DAY_ONE.label;
  dayTwoLabel = TimerLabelList.DAY_TWO.label;
  day3_10Label = TimerLabelList.DAY_3_10.label;
  dayElevenLabel = TimerLabelList.DAY_ELEVEN.label;

  @Input() endDate: GosiCalendar;
  @Input() timerHeadingLabel: string; //translation key
  constructor() {
    super();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.endDate && changes?.endDate?.currentValue) {
      this.endDate = changes?.endDate?.currentValue;
      this.startTimer();
    }
  }

  ngOnInit(): void {}

  startTimer() {
    const dDate = endOfDay(moment(this.endDate?.gregorian ? this.endDate?.gregorian : new Date()).toDate());
    setInterval(() => {
      this.calcDateDiff(dDate);
    }, 1000);
  }

  calcDateDiff(endDay: Date = new Date()) {
    const dDay = endDay.valueOf();

    const milliSecondsInASecond = 1000;
    const hoursInADay = 24;
    const minutesInAnHour = 60;
    const secondsInAMinute = 60;

    const timeDifference = dDay - Date.now();

    const daysToDday = Math.floor(
      timeDifference / (milliSecondsInASecond * minutesInAnHour * secondsInAMinute * hoursInADay)
    );

    const hoursToDday = Math.floor(
      (timeDifference / (milliSecondsInASecond * minutesInAnHour * secondsInAMinute)) % hoursInADay
    );

    const minutesToDday = Math.floor((timeDifference / (milliSecondsInASecond * minutesInAnHour)) % secondsInAMinute);

    const secondsToDday = Math.floor(timeDifference / milliSecondsInASecond) % secondsInAMinute;

    this.timeLeft$ = of({ secondsToDday, minutesToDday, hoursToDday, daysToDday });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
