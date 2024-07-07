import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAmountVATRecoveredDcComponent } from './claim-amount-vat-recovered-dc.component';

describe('ClaimAmountVATRecoveredDcComponent', () => {
  let component: ClaimAmountVATRecoveredDcComponent;
  let fixture: ComponentFixture<ClaimAmountVATRecoveredDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimAmountVATRecoveredDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAmountVATRecoveredDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
