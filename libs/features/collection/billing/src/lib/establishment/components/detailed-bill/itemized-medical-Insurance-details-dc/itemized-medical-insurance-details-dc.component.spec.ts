import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItrmizedMedicalInsuranceDetailsDcComponent } from './itemized-medical-insurance-details-dc.component';

describe('ItrmizedMedicalInsuranceDetailsDcComponent', () => {
  let component: ItrmizedMedicalInsuranceDetailsDcComponent;
  let fixture: ComponentFixture<ItrmizedMedicalInsuranceDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItrmizedMedicalInsuranceDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItrmizedMedicalInsuranceDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
