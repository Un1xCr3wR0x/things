import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectHeirPaymentScComponent } from './select-heir-payment-sc.component';

describe('SelectHeirPaymentScComponent', () => {
  let component: SelectHeirPaymentScComponent;
  let fixture: ComponentFixture<SelectHeirPaymentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectHeirPaymentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectHeirPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
