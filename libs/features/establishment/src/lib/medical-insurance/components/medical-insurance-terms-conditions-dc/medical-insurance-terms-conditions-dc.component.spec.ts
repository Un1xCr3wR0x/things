import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceTermsConditionsDcComponent } from './medical-insurance-terms-conditions-dc.component';

describe('MedicalInsuranceTermsConditionsDcComponent', () => {
  let component: MedicalInsuranceTermsConditionsDcComponent;
  let fixture: ComponentFixture<MedicalInsuranceTermsConditionsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalInsuranceTermsConditionsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceTermsConditionsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
