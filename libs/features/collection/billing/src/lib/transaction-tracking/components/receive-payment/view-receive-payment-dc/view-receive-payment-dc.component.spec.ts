import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReceivePaymentDcComponent } from './view-receive-payment-dc.component';

describe('ViewReceivePaymentDcComponent', () => {
  let component: ViewReceivePaymentDcComponent;
  let fixture: ComponentFixture<ViewReceivePaymentDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewReceivePaymentDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReceivePaymentDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
