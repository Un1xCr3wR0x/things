import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoAppealAssessmentsFormScComponent } from './ho-appeal-assessments-form-sc.component';

describe('HoAppealAssessmentsFormScComponent', () => {
  let component: HoAppealAssessmentsFormScComponent;
  let fixture: ComponentFixture<HoAppealAssessmentsFormScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HoAppealAssessmentsFormScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HoAppealAssessmentsFormScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
