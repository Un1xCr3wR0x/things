import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsDcComponent } from './payment-details-dc.component';

describe('PaymentDetailsDcComponent', () => {
  let component: PaymentDetailsDcComponent;
  let fixture: ComponentFixture<PaymentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
