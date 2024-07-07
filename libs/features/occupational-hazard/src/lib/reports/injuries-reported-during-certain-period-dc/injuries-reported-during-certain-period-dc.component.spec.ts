import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuriesReportedDuringCertainPeriodDcComponent } from './injuries-reported-during-certain-period-dc.component';

describe('InjuriesReportedDuringCertainPeriodDcComponent', () => {
  let component: InjuriesReportedDuringCertainPeriodDcComponent;
  let fixture: ComponentFixture<InjuriesReportedDuringCertainPeriodDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuriesReportedDuringCertainPeriodDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuriesReportedDuringCertainPeriodDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
