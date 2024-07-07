import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingScComponent } from './tracking-sc.component';

describe('TrackingDcComponent', () => {
  let component: TrackingScComponent;
  let fixture: ComponentFixture<TrackingScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackingScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
