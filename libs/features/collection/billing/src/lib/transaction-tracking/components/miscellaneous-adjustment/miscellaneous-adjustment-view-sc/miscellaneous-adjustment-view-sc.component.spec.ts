import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscellaneousAdjustmentViewScComponent } from './miscellaneous-adjustment-view-sc.component';

describe('MiscellaneousAdjustmentViewScComponent', () => {
  let component: MiscellaneousAdjustmentViewScComponent;
  let fixture: ComponentFixture<MiscellaneousAdjustmentViewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiscellaneousAdjustmentViewScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousAdjustmentViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
