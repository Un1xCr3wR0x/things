import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportInjuryViolationScComponent } from './report-injury-violation-sc.component';

describe('ReportInjuryViolationScComponent', () => {
  let component: ReportInjuryViolationScComponent;
  let fixture: ComponentFixture<ReportInjuryViolationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportInjuryViolationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportInjuryViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
