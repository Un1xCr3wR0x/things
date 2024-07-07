import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilityAssessmentDetailsScComponent } from './disability-assessment-details-sc.component';

describe('DisabilityAssessmentDetailsScComponent', () => {
  let component: DisabilityAssessmentDetailsScComponent;
  let fixture: ComponentFixture<DisabilityAssessmentDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisabilityAssessmentDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilityAssessmentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
