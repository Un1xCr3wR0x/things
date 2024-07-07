import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MboSessionAssessmentScComponent } from './mbo-session-assessment-sc.component';

describe('MboSessionAssessmentScComponent', () => {
  let component: MboSessionAssessmentScComponent;
  let fixture: ComponentFixture<MboSessionAssessmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MboSessionAssessmentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MboSessionAssessmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
