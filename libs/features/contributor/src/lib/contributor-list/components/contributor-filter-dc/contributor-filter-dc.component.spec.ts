import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorFilterDcComponent } from './contributor-filter-dc.component';

describe('ContributorFilterDcComponent', () => {
  let component: ContributorFilterDcComponent;
  let fixture: ComponentFixture<ContributorFilterDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorFilterDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorFilterDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
