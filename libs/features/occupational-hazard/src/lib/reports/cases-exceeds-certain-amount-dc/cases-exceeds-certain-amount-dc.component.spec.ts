import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesExceedsCertainAmountDcComponent } from './cases-exceeds-certain-amount-dc.component';

describe('CasesExceedsCertainAmountDcComponent', () => {
  let component: CasesExceedsCertainAmountDcComponent;
  let fixture: ComponentFixture<CasesExceedsCertainAmountDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasesExceedsCertainAmountDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesExceedsCertainAmountDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
