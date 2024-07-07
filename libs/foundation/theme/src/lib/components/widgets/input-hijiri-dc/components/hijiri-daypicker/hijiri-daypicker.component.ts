import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { HijiriEngine } from '../../engine/hijiri.engine';
import { DaysCalendarViewModel, DayViewModel } from '../../models';

@Component({
  selector: 'gosi-hijiri-daypicker',
  templateUrl: './hijiri-daypicker.component.html',
  styleUrls: ['./hijiri-daypicker.component.scss']
})
export class HijiriDaypickerComponent implements OnInit {
  @Output() onViewMode: EventEmitter<string> = new EventEmitter();
  @Output() onDaySelect: EventEmitter<DayViewModel> = new EventEmitter();

  days$: Observable<DaysCalendarViewModel> = null;
  calendar: DaysCalendarViewModel = {
    weeks: [],
    weekdays: []
  };

  constructor(readonly hijiriEngine: HijiriEngine) {
    this.days$ = this.hijiriEngine.getDays();
    this.days$.subscribe(res => {
      this.calendar = res;
    });
  }

  ngOnInit() {
    this.hijiriEngine.updateDays(0);
  }

  changeViewMode(e) {
    this.onViewMode.emit(e);
  }

  navigateTo(e) {
    this.hijiriEngine.updateDays(e);
  }

  selectDay(day) {
    if (!day.isDisabled) {
      this.onDaySelect.emit(day);
    }
  }

  hoverDay(day: DayViewModel, status) {
    day.isHovered = status;
  }
}
