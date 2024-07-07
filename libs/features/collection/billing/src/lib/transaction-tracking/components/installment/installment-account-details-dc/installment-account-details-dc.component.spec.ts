import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentAccountDetailsDcComponent } from './installment-account-details-dc.component';

describe('InstallmentAccountDetailsDcComponent', () => {
  let component: InstallmentAccountDetailsDcComponent;
  let fixture: ComponentFixture<InstallmentAccountDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentAccountDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentAccountDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
