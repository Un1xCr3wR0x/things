import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePaymentScComponent } from './receive-payment-sc.component';

describe('ReceivePaymentScComponent', () => {
  let component: ReceivePaymentScComponent;
  let fixture: ComponentFixture<ReceivePaymentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceivePaymentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
