import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRefundEstablishmentViewScComponent } from './credit-refund-establishment-view-sc.component';

describe('CreditRefundEstablishmentViewScComponent', () => {
  let component: CreditRefundEstablishmentViewScComponent;
  let fixture: ComponentFixture<CreditRefundEstablishmentViewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditRefundEstablishmentViewScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditRefundEstablishmentViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
