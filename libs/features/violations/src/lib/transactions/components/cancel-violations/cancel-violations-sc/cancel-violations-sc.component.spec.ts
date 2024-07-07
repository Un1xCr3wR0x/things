import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelViolationsScComponent } from './cancel-violations-sc.component';

describe('CancelViolationsScComponent', () => {
  let component: CancelViolationsScComponent;
  let fixture: ComponentFixture<CancelViolationsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelViolationsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelViolationsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
