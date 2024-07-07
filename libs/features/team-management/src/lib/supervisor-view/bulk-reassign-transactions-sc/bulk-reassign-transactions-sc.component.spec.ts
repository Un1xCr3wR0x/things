import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReassignTransactionsScComponent } from './bulk-reassign-transactions-sc.component';

describe('BulkReassignTransactionsScComponent', () => {
  let component: BulkReassignTransactionsScComponent;
  let fixture: ComponentFixture<BulkReassignTransactionsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkReassignTransactionsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkReassignTransactionsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
