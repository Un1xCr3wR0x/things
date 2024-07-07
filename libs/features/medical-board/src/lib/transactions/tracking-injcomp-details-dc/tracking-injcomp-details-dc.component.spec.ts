import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingInjcompDetailsDcComponent } from './tracking-injcomp-details-dc.component';

describe('TrackingInjcompDetailsDcComponent', () => {
  let component: TrackingInjcompDetailsDcComponent;
  let fixture: ComponentFixture<TrackingInjcompDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingInjcompDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingInjcompDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
