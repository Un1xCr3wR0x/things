import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateSecondmentStudyleaveScComponent } from './validate-secondment-studyleave-sc.component';

describe('ValidateSecondmentStudyleaveScComponent', () => {
  let component: ValidateSecondmentStudyleaveScComponent;
  let fixture: ComponentFixture<ValidateSecondmentStudyleaveScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateSecondmentStudyleaveScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateSecondmentStudyleaveScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
