import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorAssessmentScComponent } from './contributor-assessment-sc.component';

describe('ContributorAssessmentScComponent', () => {
  let component: ContributorAssessmentScComponent;
  let fixture: ComponentFixture<ContributorAssessmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorAssessmentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
