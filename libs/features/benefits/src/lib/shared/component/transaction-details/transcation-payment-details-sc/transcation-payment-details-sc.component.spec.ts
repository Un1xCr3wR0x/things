import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscationPaymentDetailsScComponent } from './transcation-payment-details-sc.component';

describe('TranscationPaymentDetailsScComponent', () => {
  let component: TranscationPaymentDetailsScComponent;
  let fixture: ComponentFixture<TranscationPaymentDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranscationPaymentDetailsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscationPaymentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
