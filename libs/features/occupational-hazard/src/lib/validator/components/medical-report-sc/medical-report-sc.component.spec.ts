import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalReportScComponent } from './medical-report-sc.component';

describe('MedicalReportScComponent', () => {
  let component: MedicalReportScComponent;
  let fixture: ComponentFixture<MedicalReportScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalReportScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalReportScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
