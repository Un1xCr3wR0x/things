import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalInsuranceFaqDcComponent } from './medical-insurance-faq-dc.component';

describe('MedicalInsuranceFaqDcComponent', () => {
  let component: MedicalInsuranceFaqDcComponent;
  let fixture: ComponentFixture<MedicalInsuranceFaqDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalInsuranceFaqDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalInsuranceFaqDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
