import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceEstablishmentListDcComponent } from './medical-insurance-establishment-list-dc.component';

describe('MedicalInsuranceEstablishmentListDcComponent', () => {
  let component: MedicalInsuranceEstablishmentListDcComponent;
  let fixture: ComponentFixture<MedicalInsuranceEstablishmentListDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalInsuranceEstablishmentListDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceEstablishmentListDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
