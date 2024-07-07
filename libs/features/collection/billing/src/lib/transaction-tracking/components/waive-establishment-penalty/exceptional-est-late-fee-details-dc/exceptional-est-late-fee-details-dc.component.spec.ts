import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionalEstLateFeeDetailsDcComponent } from './exceptional-est-late-fee-details-dc.component';

describe('ExceptionalEstLateFeeDetailsDcComponent', () => {
  let component: ExceptionalEstLateFeeDetailsDcComponent;
  let fixture: ComponentFixture<ExceptionalEstLateFeeDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExceptionalEstLateFeeDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionalEstLateFeeDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
