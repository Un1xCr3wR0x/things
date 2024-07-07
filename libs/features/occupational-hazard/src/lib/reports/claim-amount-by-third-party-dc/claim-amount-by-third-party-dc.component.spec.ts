import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimAmountByThirdPartyDcComponent } from './claim-amount-by-third-party-dc.component';

describe('ClaimAmountByThirdPartyDcComponent', () => {
  let component: ClaimAmountByThirdPartyDcComponent;
  let fixture: ComponentFixture<ClaimAmountByThirdPartyDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimAmountByThirdPartyDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimAmountByThirdPartyDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
