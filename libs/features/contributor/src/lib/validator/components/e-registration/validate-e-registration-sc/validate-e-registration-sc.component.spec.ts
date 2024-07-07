import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateERegistrationScComponent } from './validate-e-registration-sc.component';

describe('ValidateERegistrationScComponent', () => {
  let component: ValidateERegistrationScComponent;
  let fixture: ComponentFixture<ValidateERegistrationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateERegistrationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateERegistrationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
