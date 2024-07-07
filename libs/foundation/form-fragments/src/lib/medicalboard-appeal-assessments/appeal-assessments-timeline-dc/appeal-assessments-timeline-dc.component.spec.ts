import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealAssessmentsTimelineDcComponent } from './appeal-assessments-timeline-dc.component';

describe('AppealAssessmentsTimelineDcComponent', () => {
  let component: AppealAssessmentsTimelineDcComponent;
  let fixture: ComponentFixture<AppealAssessmentsTimelineDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealAssessmentsTimelineDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealAssessmentsTimelineDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
