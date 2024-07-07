import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorDirectPaymentScComponent } from './validator-direct-payment-sc.component';

describe('ValidatorDirectPaymentScComponent', () => {
  let component: ValidatorDirectPaymentScComponent;
  let fixture: ComponentFixture<ValidatorDirectPaymentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatorDirectPaymentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorDirectPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
