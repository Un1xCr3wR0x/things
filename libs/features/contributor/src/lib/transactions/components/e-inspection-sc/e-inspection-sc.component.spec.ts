import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EInspectionScComponent } from './e-inspection-sc.component';

describe('EInspectionScComponent', () => {
  let component: EInspectionScComponent;
  let fixture: ComponentFixture<EInspectionScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EInspectionScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EInspectionScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
