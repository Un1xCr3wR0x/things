import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyBankDetailsDcComponent } from './verify-bank-details-dc.component';

describe('VerifyBankDetailsDcComponent', () => {
  let component: VerifyBankDetailsDcComponent;
  let fixture: ComponentFixture<VerifyBankDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyBankDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyBankDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
