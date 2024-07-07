import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSchedulerScComponent } from './calendar-scheduler-sc.component';

describe('CalendarSchedulerScComponent', () => {
  let component: CalendarSchedulerScComponent;
  let fixture: ComponentFixture<CalendarSchedulerScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarSchedulerScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSchedulerScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
