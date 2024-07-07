import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenCompletedTransactionScComponent } from './reopen-completed-transaction-sc.component';

describe('ReopenCompletedTransactionScComponent', () => {
  let component: ReopenCompletedTransactionScComponent;
  let fixture: ComponentFixture<ReopenCompletedTransactionScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReopenCompletedTransactionScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenCompletedTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
