import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceCompanyCardComponent } from './insurance-company-card.component';

describe('InsuranceCompanyCardComponent', () => {
  let component: InsuranceCompanyCardComponent;
  let fixture: ComponentFixture<InsuranceCompanyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceCompanyCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceCompanyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
