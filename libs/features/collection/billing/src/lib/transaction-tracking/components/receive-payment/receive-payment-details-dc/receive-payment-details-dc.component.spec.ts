import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePaymentDetailsDcComponent } from './receive-payment-details-dc.component';

describe('ReceivePaymentDetailsDcComponent', () => {
  let component: ReceivePaymentDetailsDcComponent;
  let fixture: ComponentFixture<ReceivePaymentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivePaymentDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePaymentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
