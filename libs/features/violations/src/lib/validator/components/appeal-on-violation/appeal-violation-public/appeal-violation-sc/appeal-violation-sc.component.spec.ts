import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealViolationScComponent } from './appeal-violation-sc.component';

describe('AppealViolationScComponent', () => {
  let component: AppealViolationScComponent;
  let fixture: ComponentFixture<AppealViolationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealViolationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealViolationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
