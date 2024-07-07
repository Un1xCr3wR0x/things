import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectPaymentTimelineScComponent } from './direct-payment-timeline-sc.component';

describe('DirectPaymentTimelineScComponent', () => {
  let component: DirectPaymentTimelineScComponent;
  let fixture: ComponentFixture<DirectPaymentTimelineScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DirectPaymentTimelineScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectPaymentTimelineScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
