import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptSearchScComponent } from './receipt-search-sc.component';

describe('ReceiptSearchScComponent', () => {
  let component: ReceiptSearchScComponent;
  let fixture: ComponentFixture<ReceiptSearchScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceiptSearchScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptSearchScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
