import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { HijiriEngine } from '../../engine/hijiri.engine';
import { CalendarCellViewModel, MonthsCalendarViewModel } from '../../models';

@Component({
  selector: 'gosi-hijiri-monthpicker',
  templateUrl: './hijiri-monthpicker.component.html',
  styleUrls: ['./hijiri-monthpicker.component.scss']
})
export class HijiriMonthpickerComponent implements OnInit {
  @Input() contextId: string;
  @Output() onViewMode: EventEmitter<string> = new EventEmitter();
  @Output() onMonthSelect: EventEmitter<number> = new EventEmitter();

  isMonthPicker: boolean;
  months$: Observable<MonthsCalendarViewModel> = null;
  calendar: MonthsCalendarViewModel = { months: [] };

  constructor(readonly hijiriEngine: HijiriEngine) {
    this.months$ = this.hijiriEngine.getMonths();
    this.months$.subscribe(res => {
      this.calendar = res;
    });
  }

  ngOnInit() {
    this.isMonthPicker = this.hijiriEngine.getIsMonthPicker(this.contextId);
    this.hijiriEngine.updateMonth(0);
  }

  changeViewMode(e) {
    this.onViewMode.emit(e);
  }

  navigateTo(e) {
    this.hijiriEngine.updateMonth(e);
  }

  viewMonth(month) {
    if (!month.isDisabled) {
      if (this.isMonthPicker) month.isSelected = true;
      this.onMonthSelect.emit(month);
    }
  }

  hoverMonth(month: CalendarCellViewModel, status) {
    month.isHovered = status;
  }
}
