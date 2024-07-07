import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingESignScComponent } from './tracking-e-sign-sc.component';

describe('TrackingESignScComponent', () => {
  let component: TrackingESignScComponent;
  let fixture: ComponentFixture<TrackingESignScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingESignScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingESignScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
