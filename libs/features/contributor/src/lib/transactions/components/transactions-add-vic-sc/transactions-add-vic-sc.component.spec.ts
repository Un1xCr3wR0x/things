import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsAddVicScComponent } from './transactions-add-vic-sc.component';

describe('TransactionsAddVicScComponent', () => {
  let component: TransactionsAddVicScComponent;
  let fixture: ComponentFixture<TransactionsAddVicScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionsAddVicScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsAddVicScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
