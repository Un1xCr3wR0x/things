import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousAssessmentDetailsDcComponent } from './previous-assessment-details-dc.component';

describe('PreviousAssessmentDetailsDcComponent', () => {
  let component: PreviousAssessmentDetailsDcComponent;
  let fixture: ComponentFixture<PreviousAssessmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousAssessmentDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousAssessmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
