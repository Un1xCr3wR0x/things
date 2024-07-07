import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeirDirectPaymentScComponent } from './heir-direct-payment-sc.component';

describe('HeirDirectPaymentScComponent', () => {
  let component: HeirDirectPaymentScComponent;
  let fixture: ComponentFixture<HeirDirectPaymentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeirDirectPaymentScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirDirectPaymentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
