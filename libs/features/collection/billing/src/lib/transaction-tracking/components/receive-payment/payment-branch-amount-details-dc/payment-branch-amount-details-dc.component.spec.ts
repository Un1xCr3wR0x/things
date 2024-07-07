import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBranchAmountDetailsDcComponent } from './payment-branch-amount-details-dc.component';

describe('PaymentBranchAmountDetailsDcComponent', () => {
  let component: PaymentBranchAmountDetailsDcComponent;
  let fixture: ComponentFixture<PaymentBranchAmountDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentBranchAmountDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBranchAmountDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
