import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateWrongBenefitsScComponent } from './validate-wrong-benefits-sc.component';

describe('ValidateWrongBenefitsScComponent', () => {
  let component: ValidateWrongBenefitsScComponent;
  let fixture: ComponentFixture<ValidateWrongBenefitsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidateWrongBenefitsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateWrongBenefitsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
