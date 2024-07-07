import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ETransactionComponent } from './e-transaction.component';

describe('ETransactionComponent', () => {
  let component: ETransactionComponent;
  let fixture: ComponentFixture<ETransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ETransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ETransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
