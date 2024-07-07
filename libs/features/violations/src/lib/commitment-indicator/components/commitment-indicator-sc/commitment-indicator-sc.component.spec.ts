import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentIndicatorScComponent } from './commitment-indicator-sc.component';

describe('CommitmentIndicatorScComponent', () => {
  let component: CommitmentIndicatorScComponent;
  let fixture: ComponentFixture<CommitmentIndicatorScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommitmentIndicatorScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentIndicatorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
