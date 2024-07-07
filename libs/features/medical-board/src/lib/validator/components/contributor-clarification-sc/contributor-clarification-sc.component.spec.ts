import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorClarificationScComponent } from './contributor-clarification-sc.component';

describe('ContributorClarificationScComponent', () => {
  let component: ContributorClarificationScComponent;
  let fixture: ComponentFixture<ContributorClarificationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorClarificationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorClarificationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
