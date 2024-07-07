import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceEnrollScComponent } from './medical-insurance-enroll-sc.component';

describe('MedicalInsuranceEnrollScComponent', () => {
  let component: MedicalInsuranceEnrollScComponent;
  let fixture: ComponentFixture<MedicalInsuranceEnrollScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalInsuranceEnrollScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceEnrollScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
