import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentEstablishmentDetailsDcComponent } from './installment-establishment-details-dc.component';

describe('InstallmentEstablishmentDetailsDcComponent', () => {
  let component: InstallmentEstablishmentDetailsDcComponent;
  let fixture: ComponentFixture<InstallmentEstablishmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentEstablishmentDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentEstablishmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
