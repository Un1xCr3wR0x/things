import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingContributorDetailsDcComponent } from './tracking-contributor-details-dc.component';

describe('TrackingContributorDetailsDcComponent', () => {
  let component: TrackingContributorDetailsDcComponent;
  let fixture: ComponentFixture<TrackingContributorDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingContributorDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingContributorDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
