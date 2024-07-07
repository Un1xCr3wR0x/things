import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentBankAccountDetailsScComponent } from './establishment-bank-account-details-sc.component';

describe('EstablishmentBankAccountDetailsScComponent', () => {
  let component: EstablishmentBankAccountDetailsScComponent;
  let fixture: ComponentFixture<EstablishmentBankAccountDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentBankAccountDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentBankAccountDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
