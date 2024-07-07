import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateAppealOnViolationScComponent } from './validate-appeal-on-violation-sc.component';

describe('ValidateAppealOnViolationScComponent', () => {
  let component: ValidateAppealOnViolationScComponent;
  let fixture: ComponentFixture<ValidateAppealOnViolationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateAppealOnViolationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAppealOnViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
