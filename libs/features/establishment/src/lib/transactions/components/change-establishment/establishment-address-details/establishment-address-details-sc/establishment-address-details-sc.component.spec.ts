import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentAddressDetailsScComponent } from './establishment-address-details-sc.component';

describe('EstablishmentAddressDetailsScComponent', () => {
  let component: EstablishmentAddressDetailsScComponent;
  let fixture: ComponentFixture<EstablishmentAddressDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentAddressDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentAddressDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
