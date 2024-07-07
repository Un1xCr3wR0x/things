import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealAssessmentFormScComponent } from './appeal-assessment-form-sc.component';

describe('AppealAssessmentFormScComponent', () => {
  let component: AppealAssessmentFormScComponent;
  let fixture: ComponentFixture<AppealAssessmentFormScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealAssessmentFormScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealAssessmentFormScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
