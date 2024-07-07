import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceAcknowledgementDcComponent } from './medical-insurance-acknowledgement-dc.component';

describe('MedicalInsuranceAcknowledgementDcComponent', () => {
  let component: MedicalInsuranceAcknowledgementDcComponent;
  let fixture: ComponentFixture<MedicalInsuranceAcknowledgementDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalInsuranceAcknowledgementDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceAcknowledgementDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
