import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallmentDetailsScComponent } from './installment-details-sc.component';

describe('InstallmentDetailsScComponent', () => {
  let component: InstallmentDetailsScComponent;
  let fixture: ComponentFixture<InstallmentDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallmentDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallmentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
