import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBaseScComponent } from './transaction-base-sc.component';

describe('TransactionBaseScComponent', () => {
  let component: TransactionBaseScComponent;
  let fixture: ComponentFixture<TransactionBaseScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionBaseScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionBaseScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
