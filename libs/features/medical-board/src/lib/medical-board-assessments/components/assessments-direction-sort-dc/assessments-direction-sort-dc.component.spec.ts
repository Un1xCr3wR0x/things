import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsDirectionSortDcComponent } from './assessments-direction-sort-dc.component';

describe('AssessmentsDirectionSortDcComponent', () => {
  let component: AssessmentsDirectionSortDcComponent;
  let fixture: ComponentFixture<AssessmentsDirectionSortDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssessmentsDirectionSortDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentsDirectionSortDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
