import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditTransferScComponent } from './credit-transfer-sc.component';

describe('CreditTransferScComponent', () => {
  let component: CreditTransferScComponent;
  let fixture: ComponentFixture<CreditTransferScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreditTransferScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditTransferScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
