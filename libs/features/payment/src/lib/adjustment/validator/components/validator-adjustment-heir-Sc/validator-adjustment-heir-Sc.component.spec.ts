import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorAdjustmentHeirScComponent } from './validator-adjustment-heir-Sc.component';

describe('ValidatorAdjustmentHeirScComponent', () => {
  let component: ValidatorAdjustmentHeirScComponent;
  let fixture: ComponentFixture<ValidatorAdjustmentHeirScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidatorAdjustmentHeirScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorAdjustmentHeirScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
