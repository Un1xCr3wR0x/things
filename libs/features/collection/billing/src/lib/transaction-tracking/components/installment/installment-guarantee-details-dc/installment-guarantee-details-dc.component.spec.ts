import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentGuaranteeDetailsDcComponent } from './installment-guarantee-details-dc.component';

describe('InstallmentGuaranteeDetailsDcComponent', () => {
  let component: InstallmentGuaranteeDetailsDcComponent;
  let fixture: ComponentFixture<InstallmentGuaranteeDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentGuaranteeDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentGuaranteeDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
