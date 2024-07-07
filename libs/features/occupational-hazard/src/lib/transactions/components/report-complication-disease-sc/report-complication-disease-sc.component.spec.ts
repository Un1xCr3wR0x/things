import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportComplicationDiseaseScComponent } from './report-complication-disease-sc.component';

describe('ReportComplicationDiseaseScComponent', () => {
  let component: ReportComplicationDiseaseScComponent;
  let fixture: ComponentFixture<ReportComplicationDiseaseScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportComplicationDiseaseScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComplicationDiseaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
