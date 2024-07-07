import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousContributorViolationsScComponent } from './previous-contributor-violations-sc.component';

describe('PreviousContributorViolationsScComponent', () => {
  let component: PreviousContributorViolationsScComponent;
  let fixture: ComponentFixture<PreviousContributorViolationsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousContributorViolationsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousContributorViolationsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
