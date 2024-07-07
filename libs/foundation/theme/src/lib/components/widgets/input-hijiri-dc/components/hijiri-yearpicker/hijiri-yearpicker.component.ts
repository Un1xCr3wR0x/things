import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarCellViewModel } from 'ngx-bootstrap/datepicker/models';
import { Observable } from 'rxjs';
import { HijiriEngine } from '../../engine/hijiri.engine';
import { YearsCalendarViewModel } from '../../models';

@Component({
  selector: 'gosi-hijiri-yearpicker',
  templateUrl: './hijiri-yearpicker.component.html',
  styleUrls: ['./hijiri-yearpicker.component.scss']
})
export class HijiriYearpickerComponent implements OnInit {
  @Output() onViewMode: EventEmitter<string> = new EventEmitter();
  @Output() onYearSelect: EventEmitter<number> = new EventEmitter();

  years$: Observable<YearsCalendarViewModel> = null;
  calendar: YearsCalendarViewModel = { years: [] };

  constructor(readonly hijiriEngine: HijiriEngine) {
    this.years$ = this.hijiriEngine.getYears();
    this.years$.subscribe(res => {
      this.calendar = res;
    });
  }

  ngOnInit() {
    this.hijiriEngine.updateYear(0);
  }

  changeViewMode(e) {
    this.onViewMode.emit(e);
  }

  navigateTo(state) {
    this.hijiriEngine.updateYear(state);
  }

  viewYear(year) {
    if (!year.isDisabled) {
      this.onYearSelect.emit(year);
    }
  }

  hoverYear(year: CalendarCellViewModel, status) {
    year.isHovered = status;
  }
}
