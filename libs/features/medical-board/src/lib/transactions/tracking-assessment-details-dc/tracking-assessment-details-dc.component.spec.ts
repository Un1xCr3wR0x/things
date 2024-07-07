import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingAssessmentDetailsDcComponent } from './tracking-assessment-details-dc.component';

describe('TrackingAssessmentDetailsDcComponent', () => {
  let component: TrackingAssessmentDetailsDcComponent;
  let fixture: ComponentFixture<TrackingAssessmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingAssessmentDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingAssessmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
