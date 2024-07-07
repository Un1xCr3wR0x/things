import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedierctToSelectedInsuranceCompanyComponent } from './redierct-to-selected-insurance-company.component';

describe('RedierctToSelectedInsuranceCompanyComponent', () => {
  let component: RedierctToSelectedInsuranceCompanyComponent;
  let fixture: ComponentFixture<RedierctToSelectedInsuranceCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedierctToSelectedInsuranceCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedierctToSelectedInsuranceCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
