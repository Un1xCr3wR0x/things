import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRefundVicViewScComponent } from './credit-refund-vic-view-sc.component';

describe('CreditRefundVicViewScComponent', () => {
  let component: CreditRefundVicViewScComponent;
  let fixture: ComponentFixture<CreditRefundVicViewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditRefundVicViewScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditRefundVicViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
