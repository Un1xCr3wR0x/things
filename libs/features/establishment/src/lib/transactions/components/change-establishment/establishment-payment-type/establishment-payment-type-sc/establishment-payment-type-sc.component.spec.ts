import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentPaymentTypeScComponent } from './establishment-payment-type-sc.component';

describe('EstablishmentPaymentTypeScComponent', () => {
  let component: EstablishmentPaymentTypeScComponent;
  let fixture: ComponentFixture<EstablishmentPaymentTypeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentPaymentTypeScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentPaymentTypeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
