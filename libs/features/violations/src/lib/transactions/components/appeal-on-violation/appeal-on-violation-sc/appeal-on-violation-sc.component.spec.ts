import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealOnViolationScComponent } from './appeal-on-violation-sc.component';

describe('AppealOnViolationScComponent', () => {
  let component: AppealOnViolationScComponent;
  let fixture: ComponentFixture<AppealOnViolationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealOnViolationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealOnViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
