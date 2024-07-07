import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFormDcComponent } from './report-form-dc.component';

describe('ReportFormDcComponent', () => {
  let component: ReportFormDcComponent;
  let fixture: ComponentFixture<ReportFormDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportFormDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFormDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
