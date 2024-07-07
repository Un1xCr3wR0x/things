import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainAdjustmentComponent } from './maintain-adjustment-sc.component';

describe('MaintainAdjustmentComponent', () => {
  let component: MaintainAdjustmentComponent;
  let fixture: ComponentFixture<MaintainAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaintainAdjustmentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
