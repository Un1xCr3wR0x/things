import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentIndicatorHistoryDcComponent } from './commitment-indicator-history-dc.component';

describe('CommitmentIndicatorHistoryDcComponent', () => {
  let component: CommitmentIndicatorHistoryDcComponent;
  let fixture: ComponentFixture<CommitmentIndicatorHistoryDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitmentIndicatorHistoryDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentIndicatorHistoryDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
