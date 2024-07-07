import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionConveyanceScComponent } from './transaction-conveyance-sc.component';

describe('TransactionConveyanceScComponent', () => {
  let component: TransactionConveyanceScComponent;
  let fixture: ComponentFixture<TransactionConveyanceScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionConveyanceScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionConveyanceScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
