import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDcComponent } from './survey-dc.component';

describe('SurveyDcComponent', () => {
  let component: SurveyDcComponent;
  let fixture: ComponentFixture<SurveyDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
