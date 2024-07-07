import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarItemDcComponent } from './calendar-item-dc.component';

describe('CalendarItemDcComponent', () => {
  let component: CalendarItemDcComponent;
  let fixture: ComponentFixture<CalendarItemDcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarItemDcComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarItemDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
