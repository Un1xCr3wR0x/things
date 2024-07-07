import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateAppealScComponent } from './validate-appeal-sc.component';

describe('ValidateAppealScComponent', () => {
  let component: ValidateAppealScComponent;
  let fixture: ComponentFixture<ValidateAppealScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateAppealScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateAppealScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
