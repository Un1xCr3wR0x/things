import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRefundDetailsDcComponent } from './credit-refund-details-dc.component';

describe('CreditRefundDetailsDcComponent', () => {
  let component: CreditRefundDetailsDcComponent;
  let fixture: ComponentFixture<CreditRefundDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditRefundDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditRefundDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
