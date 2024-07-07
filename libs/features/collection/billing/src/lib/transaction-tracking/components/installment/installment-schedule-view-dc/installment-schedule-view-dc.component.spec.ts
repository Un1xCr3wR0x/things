import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentScheduleViewDcComponent } from './installment-schedule-view-dc.component';

describe('InstallmentScheduleViewDcComponent', () => {
  let component: InstallmentScheduleViewDcComponent;
  let fixture: ComponentFixture<InstallmentScheduleViewDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentScheduleViewDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentScheduleViewDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
