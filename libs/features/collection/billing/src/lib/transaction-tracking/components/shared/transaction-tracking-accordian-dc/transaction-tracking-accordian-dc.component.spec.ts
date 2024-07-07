import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionTrackingAccordianDcComponent } from './transaction-tracking-accordian-dc.component';

describe('TransactionTrackingAccordianDcComponent', () => {
  let component: TransactionTrackingAccordianDcComponent;
  let fixture: ComponentFixture<TransactionTrackingAccordianDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionTrackingAccordianDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionTrackingAccordianDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
