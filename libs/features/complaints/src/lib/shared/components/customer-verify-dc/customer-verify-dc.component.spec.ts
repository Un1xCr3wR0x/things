import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVerifyDcComponent } from './customer-verify-dc.component';

describe('CustomerVerifyDcComponent', () => {
  let component: CustomerVerifyDcComponent;
  let fixture: ComponentFixture<CustomerVerifyDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerVerifyDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerVerifyDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
