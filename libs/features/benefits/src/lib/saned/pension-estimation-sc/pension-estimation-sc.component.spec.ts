import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PensionEstimationScComponent } from './pension-estimation-sc.component';

describe('PensionEstimationScComponent', () => {
  let component: PensionEstimationScComponent;
  let fixture: ComponentFixture<PensionEstimationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PensionEstimationScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PensionEstimationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
