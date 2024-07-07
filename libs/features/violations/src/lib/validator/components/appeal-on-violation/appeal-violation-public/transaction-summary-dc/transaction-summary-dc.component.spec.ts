import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSummaryDcComponent } from './transaction-summary-dc.component';

describe('AppealViolationSummaryTransactionDcComponent', () => {
  let component: TransactionSummaryDcComponent;
  let fixture: ComponentFixture<TransactionSummaryDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionSummaryDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionSummaryDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
