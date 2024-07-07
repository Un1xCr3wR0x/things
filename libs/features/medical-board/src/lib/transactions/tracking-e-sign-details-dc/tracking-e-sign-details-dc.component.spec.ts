import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingESignDetailsDcComponent } from './tracking-e-sign-details-dc.component';

describe('TrackingESignDetailsDcComponent', () => {
  let component: TrackingESignDetailsDcComponent;
  let fixture: ComponentFixture<TrackingESignDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingESignDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingESignDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
