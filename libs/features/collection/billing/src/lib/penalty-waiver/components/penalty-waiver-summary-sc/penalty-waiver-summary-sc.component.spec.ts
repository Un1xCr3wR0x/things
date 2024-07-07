import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyWaiverSummaryScComponent } from './penalty-waiver-summary-sc.component';

describe('PenaltyWaiverSummaryScComponent', () => {
  let component: PenaltyWaiverSummaryScComponent;
  let fixture: ComponentFixture<PenaltyWaiverSummaryScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PenaltyWaiverSummaryScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PenaltyWaiverSummaryScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
