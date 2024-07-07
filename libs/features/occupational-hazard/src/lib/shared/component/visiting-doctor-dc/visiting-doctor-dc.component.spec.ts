import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitingDoctorDcComponent } from './visiting-doctor-dc.component';

describe('VisitingDoctorDcComponent', () => {
  let component: VisitingDoctorDcComponent;
  let fixture: ComponentFixture<VisitingDoctorDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitingDoctorDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitingDoctorDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
