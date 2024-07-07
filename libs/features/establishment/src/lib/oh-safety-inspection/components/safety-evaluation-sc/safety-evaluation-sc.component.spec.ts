import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyEvaluationScComponent } from './safety-evaluation-sc.component';

describe('SafetyEvaluationScComponent', () => {
  let component: SafetyEvaluationScComponent;
  let fixture: ComponentFixture<SafetyEvaluationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafetyEvaluationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyEvaluationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
