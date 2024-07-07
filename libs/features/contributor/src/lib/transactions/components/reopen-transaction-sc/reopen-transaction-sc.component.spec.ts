import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenTransactionScComponent } from './reopen-transaction-sc.component';

describe('ReopenTransactionScComponent', () => {
  let component: ReopenTransactionScComponent;
  let fixture: ComponentFixture<ReopenTransactionScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReopenTransactionScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
