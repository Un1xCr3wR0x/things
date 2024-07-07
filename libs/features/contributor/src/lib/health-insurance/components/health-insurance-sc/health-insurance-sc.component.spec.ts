import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInsuranceScComponent } from './health-insurance-sc.component';

describe('HealthInsuranceScComponent', () => {
  let component: HealthInsuranceScComponent;
  let fixture: ComponentFixture<HealthInsuranceScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthInsuranceScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInsuranceScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
