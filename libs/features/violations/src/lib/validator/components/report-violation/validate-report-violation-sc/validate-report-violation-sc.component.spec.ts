import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateReportViolationScComponent } from './validate-report-violation-sc.component';

describe('ValidateReportViolationScComponent', () => {
  let component: ValidateReportViolationScComponent;
  let fixture: ComponentFixture<ValidateReportViolationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidateReportViolationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateReportViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
