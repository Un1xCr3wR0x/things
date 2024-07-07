import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterRpaTransactionScComponent } from './enter-rpa-transaction-sc.component';

describe('EnterRpaTransactionScComponent', () => {
  let component: EnterRpaTransactionScComponent;
  let fixture: ComponentFixture<EnterRpaTransactionScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterRpaTransactionScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterRpaTransactionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
