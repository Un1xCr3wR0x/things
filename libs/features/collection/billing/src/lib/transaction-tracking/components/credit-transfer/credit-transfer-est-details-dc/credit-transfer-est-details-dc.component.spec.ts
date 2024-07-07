import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTransferEstDetailsDcComponent } from './credit-transfer-est-details-dc.component';

describe('CreditTransferEstDetailsDcComponent', () => {
  let component: CreditTransferEstDetailsDcComponent;
  let fixture: ComponentFixture<CreditTransferEstDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditTransferEstDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTransferEstDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
