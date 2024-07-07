import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInsuranceListComponent } from './health-insurance-list.component';

describe('HealthInsuranceListComponent', () => {
  let component: HealthInsuranceListComponent;
  let fixture: ComponentFixture<HealthInsuranceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthInsuranceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInsuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
