import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRefundEstablishmentDetailsDcComponent } from './credit-refund-establishment-details-dc.component';

describe('CreditRefundEstablishmentDetailsDcComponent', () => {
  let component: CreditRefundEstablishmentDetailsDcComponent;
  let fixture: ComponentFixture<CreditRefundEstablishmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditRefundEstablishmentDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditRefundEstablishmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
