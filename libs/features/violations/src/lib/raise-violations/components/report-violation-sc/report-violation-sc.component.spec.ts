import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViolationScComponent } from './report-violation-sc.component';

describe('ReportViolationScComponent', () => {
  let component: ReportViolationScComponent;
  let fixture: ComponentFixture<ReportViolationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportViolationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
