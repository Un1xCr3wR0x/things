import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInsuranceDetailsDcComponent } from './health-insurance-details-dc.component';

describe('HealthInsuranceScComponent', () => {
  let component: HealthInsuranceDetailsDcComponent;
  let fixture: ComponentFixture<HealthInsuranceDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthInsuranceDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInsuranceDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
