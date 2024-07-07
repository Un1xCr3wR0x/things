import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisabilitySpecialityDetailsDcComponent } from './disability-speciality-details-dc.component';

describe('DisabilitySpecialityDetailsDcComponent', () => {
  let component: DisabilitySpecialityDetailsDcComponent;
  let fixture: ComponentFixture<DisabilitySpecialityDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisabilitySpecialityDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisabilitySpecialityDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
