import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyInspectionScComponent } from './safety-inspection-sc.component';

describe('SafetyInspectionScComponent', () => {
  let component: SafetyInspectionScComponent;
  let fixture: ComponentFixture<SafetyInspectionScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafetyInspectionScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyInspectionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
