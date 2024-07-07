import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionEstablishmentDetailsDcComponent } from './transaction-establishment-details-dc.component';

describe('TransactionEstablishmentDetailsDcComponent', () => {
  let component: TransactionEstablishmentDetailsDcComponent;
  let fixture: ComponentFixture<TransactionEstablishmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionEstablishmentDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionEstablishmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
