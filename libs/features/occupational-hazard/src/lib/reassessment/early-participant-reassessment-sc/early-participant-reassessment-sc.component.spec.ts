import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyParticipantReassessmentScComponent } from './early-participant-reassessment-sc.component';

describe('EarlyParticipantReassessmentScComponent', () => {
  let component: EarlyParticipantReassessmentScComponent;
  let fixture: ComponentFixture<EarlyParticipantReassessmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyParticipantReassessmentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyParticipantReassessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
