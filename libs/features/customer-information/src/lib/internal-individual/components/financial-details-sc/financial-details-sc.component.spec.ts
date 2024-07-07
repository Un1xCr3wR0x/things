import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialDetailsScComponent } from './financial-details-sc.component';

describe('FinancialDetailsScComponent', () => {
  let component: FinancialDetailsScComponent;
  let fixture: ComponentFixture<FinancialDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinancialDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
