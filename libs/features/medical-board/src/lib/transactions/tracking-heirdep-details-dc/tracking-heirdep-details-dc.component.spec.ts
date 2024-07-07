import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingHeirdepDetailsDcComponent } from './tracking-heirdep-details-dc.component';

describe('TrackingHeirdepDetailsDcComponent', () => {
  let component: TrackingHeirdepDetailsDcComponent;
  let fixture: ComponentFixture<TrackingHeirdepDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingHeirdepDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingHeirdepDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
