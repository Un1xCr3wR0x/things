import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyScComponent } from './survey-sc.component';

describe('SurveyScComponent', () => {
  let component: SurveyScComponent;
  let fixture: ComponentFixture<SurveyScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
