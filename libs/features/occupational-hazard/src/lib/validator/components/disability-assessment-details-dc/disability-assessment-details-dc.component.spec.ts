import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityAssessmentDetailsDcComponent } from './disability-assessment-details-dc.component';

describe('DisabilityAssessmentDetailsDcComponent', () => {
  let component: DisabilityAssessmentDetailsDcComponent;
  let fixture: ComponentFixture<DisabilityAssessmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabilityAssessmentDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityAssessmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
