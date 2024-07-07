import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalenderRadioDcComponent } from './calender-radio-dc.component';

describe('CalenderRadioDcComponent', () => {
  let component: CalenderRadioDcComponent;
  let fixture: ComponentFixture<CalenderRadioDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalenderRadioDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalenderRadioDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
