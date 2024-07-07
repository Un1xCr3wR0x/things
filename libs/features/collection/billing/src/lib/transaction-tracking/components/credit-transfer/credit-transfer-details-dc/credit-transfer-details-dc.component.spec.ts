import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTransferDetailsDcComponent } from './credit-transfer-details-dc.component';

describe('CreditTransferDetailsDcComponent', () => {
  let component: CreditTransferDetailsDcComponent;
  let fixture: ComponentFixture<CreditTransferDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditTransferDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTransferDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
