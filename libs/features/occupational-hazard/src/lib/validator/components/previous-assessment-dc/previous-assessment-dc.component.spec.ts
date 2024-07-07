import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousAssessmentDcComponent } from './previous-assessment-dc.component';

describe('PreviousAssessmentDcComponent', () => {
  let component: PreviousAssessmentDcComponent;
  let fixture: ComponentFixture<PreviousAssessmentDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviousAssessmentDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousAssessmentDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
