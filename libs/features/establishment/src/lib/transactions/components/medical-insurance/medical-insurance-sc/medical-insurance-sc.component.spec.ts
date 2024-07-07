import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceScComponent } from './medical-insurance-sc.component';

describe('MedicalInsuranceScComponent', () => {
  let component: MedicalInsuranceScComponent;
  let fixture: ComponentFixture<MedicalInsuranceScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalInsuranceScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
