import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorDetailsDcComponent } from './contributor-details-dc.component';

describe('ContributorDetailsDcComponent', () => {
  let component: ContributorDetailsDcComponent;
  let fixture: ComponentFixture<ContributorDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
