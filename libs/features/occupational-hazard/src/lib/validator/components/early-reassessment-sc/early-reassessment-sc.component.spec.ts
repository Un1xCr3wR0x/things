import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyReassessmentScComponent } from './early-reassessment-sc.component';

describe('EarlyReassessmentScComponent', () => {
  let component: EarlyReassessmentScComponent;
  let fixture: ComponentFixture<EarlyReassessmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyReassessmentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyReassessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
