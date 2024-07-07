import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsReactivateEngagementScComponent } from './transactions-reactivate-engagement-sc.component';

describe('TransactionsReactivateEngagementScComponent', () => {
  let component: TransactionsReactivateEngagementScComponent;
  let fixture: ComponentFixture<TransactionsReactivateEngagementScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionsReactivateEngagementScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsReactivateEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
