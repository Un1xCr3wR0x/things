import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorDisabilityAssessmentScComponent } from './validator-disability-assessment-sc.component';

describe('ValidatorDisabilityAssessmentScComponent', () => {
  let component: ValidatorDisabilityAssessmentScComponent;
  let fixture: ComponentFixture<ValidatorDisabilityAssessmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatorDisabilityAssessmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorDisabilityAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
