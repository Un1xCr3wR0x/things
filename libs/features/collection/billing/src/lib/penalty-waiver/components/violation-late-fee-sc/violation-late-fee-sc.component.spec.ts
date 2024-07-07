import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationLateFeeScComponent } from './violation-late-fee-sc.component';

describe('ViolationLateFeeScComponent', () => {
  let component: ViolationLateFeeScComponent;
  let fixture: ComponentFixture<ViolationLateFeeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViolationLateFeeScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationLateFeeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
