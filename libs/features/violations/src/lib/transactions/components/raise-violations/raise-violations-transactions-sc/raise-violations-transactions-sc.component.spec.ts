import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseViolationsTransactionsScComponent } from './raise-violations-transactions-sc.component';

describe('RaiseViolationsTransactionsScComponent', () => {
  let component: RaiseViolationsTransactionsScComponent;
  let fixture: ComponentFixture<RaiseViolationsTransactionsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RaiseViolationsTransactionsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseViolationsTransactionsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
