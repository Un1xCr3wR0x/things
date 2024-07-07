import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelRpaPerDetailsDcComponent } from './cancel-rpa-per-details-dc.component';

describe('CancelRpaPerDetailsDcComponent', () => {
  let component: CancelRpaPerDetailsDcComponent;
  let fixture: ComponentFixture<CancelRpaPerDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelRpaPerDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelRpaPerDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
