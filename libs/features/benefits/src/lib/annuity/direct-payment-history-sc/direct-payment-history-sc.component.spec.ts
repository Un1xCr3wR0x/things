import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPaymentHistoryScComponent } from './direct-payment-history-sc.component';

describe('DirectPaymentHistoryScComponent', () => {
  let component: DirectPaymentHistoryScComponent;
  let fixture: ComponentFixture<DirectPaymentHistoryScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectPaymentHistoryScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectPaymentHistoryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
