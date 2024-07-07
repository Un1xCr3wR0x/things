import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustmentHeirDcComponent } from './adjustment-heir-dc.component';

describe('AdjustmentHeirDcComponent', () => {
  let component: AdjustmentHeirDcComponent;
  let fixture: ComponentFixture<AdjustmentHeirDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdjustmentHeirDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustmentHeirDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
