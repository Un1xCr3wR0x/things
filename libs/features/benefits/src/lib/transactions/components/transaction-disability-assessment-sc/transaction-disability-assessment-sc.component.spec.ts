import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDisabilityAssessmentScComponent } from './transaction-disability-assessment-sc.component';

describe('TransactionDisabilityAssessmentScComponent', () => {
  let component: TransactionDisabilityAssessmentScComponent;
  let fixture: ComponentFixture<TransactionDisabilityAssessmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionDisabilityAssessmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDisabilityAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
