/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@gosi-ui/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TimingList } from './timing';

@Component({
  selector: 'gosi-timer-dc',
  templateUrl: './timer-dc.component.html',
  styleUrls: ['./timer-dc.component.scss']
})
export class TimerDcComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() min = 0;
  @Input() sec: 0;
  @Input() isStyle: any;
  timer: BehaviorSubject<string> = new BehaviorSubject('next');
  timer$: Observable<string>;
  timeLeft: string;
  seconds: any;

  @Output() timerStopped: EventEmitter<null> = new EventEmitter();
  selectedLang = 'en';
  timingMinKey: string = TimingList.TIME_MIN.key;
  timeText = TimingList.TIME_MIN.label;
  timingSecKey: string = TimingList.TIME_SEC.key;
  timeSecText = TimingList.TIME_SEC.label;
  constructor() {
    super();
  }

  ngOnInit() {
    this.timer$ = this.timer.asObservable();
    if (this.min === 0) {
      this.min = 1;
    }
    if (this.sec > 0) {
      this.seconds = this.sec;
    } else {
      this.seconds = '59';
    }
    this.timer.next('next');
    this.timer$.subscribe(() => {
      setTimeout(() => {
        if (this.min !== 0 || Number(this.seconds) !== 0) {
          if (Number(this.seconds) === 0) {
            this.seconds = '60';
            this.min = this.min - 1;
          }
          this.seconds = String(Number(this.seconds) - 1);
          if (Number(this.seconds) < 10) {
            this.seconds = '0' + this.seconds;
          }
          this.timer.next('next');
        } else {
          this.timerStopped.emit();
        }
      }, 1000);
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.timer.complete();
  }
}
