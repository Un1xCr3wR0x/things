import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentIndicatorDcComponent } from './commitment-indicator-dc.component';

describe('CommitmentIndicatorDcComponent', () => {
  let component: CommitmentIndicatorDcComponent;
  let fixture: ComponentFixture<CommitmentIndicatorDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitmentIndicatorDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentIndicatorDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
