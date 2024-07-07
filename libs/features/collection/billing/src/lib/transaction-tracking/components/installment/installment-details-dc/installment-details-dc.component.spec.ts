import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentDetailsDcComponent } from './installment-details-dc.component';

describe('InstallmentDetailsDcComponent', () => {
  let component: InstallmentDetailsDcComponent;
  let fixture: ComponentFixture<InstallmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
