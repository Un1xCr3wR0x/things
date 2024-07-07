import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuriesPassedCertainPeriodSinceReportedDcComponent } from './injuries-passed-certain-period-since-reported-dc.component';

describe('InjuriesPassedCertainPeriodSinceReportedDcComponent', () => {
  let component: InjuriesPassedCertainPeriodSinceReportedDcComponent;
  let fixture: ComponentFixture<InjuriesPassedCertainPeriodSinceReportedDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuriesPassedCertainPeriodSinceReportedDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuriesPassedCertainPeriodSinceReportedDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
