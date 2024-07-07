import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSummaryDcComponent } from './customer-summary-dc.component';

describe('SummaryAppealDcComponent', () => {
  let component: CustomerSummaryDcComponent;
  let fixture: ComponentFixture<CustomerSummaryDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSummaryDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSummaryDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
