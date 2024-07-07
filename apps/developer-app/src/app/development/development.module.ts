import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevelopmentScComponent } from './development-sc/development-sc.component';
import { CalendarItemDcComponent } from './calendar-item-dc/calendar-item-dc.component';
import { DataCarousalDcComponent } from './data-carousal-dc/data-carousal-dc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { CalendarViewDcComponent } from './calendar-view-dc/calendar-view-dc.component';
import { CalendarSchedulerScComponent } from './calendar-scheduler-sc/calendar-scheduler-sc.component';
import { NgxSimpleCalendarModule } from 'ngx-simple-calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarDcComponent } from './full-calendar-dc/full-calendar-dc.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({
  declarations: [
    DevelopmentScComponent,
    CalendarItemDcComponent,
    DataCarousalDcComponent,
    CalendarViewDcComponent,
    CalendarSchedulerScComponent,
    FullCalendarDcComponent
  ],
  imports: [CommonModule, ThemeModule, BrowserAnimationsModule, NgxSimpleCalendarModule, FullCalendarModule],
  exports: [CalendarItemDcComponent, DataCarousalDcComponent]
})
export class DevelopmentModule {}
