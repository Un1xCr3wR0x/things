import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePaymentEstDetailsDcComponent } from './receive-payment-est-details-dc.component';

describe('ReceivePaymentEstDetailsDcComponent', () => {
  let component: ReceivePaymentEstDetailsDcComponent;
  let fixture: ComponentFixture<ReceivePaymentEstDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivePaymentEstDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePaymentEstDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
