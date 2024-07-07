import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealReasonFormDcComponent } from './appeal-reason-form-dc.component';

describe('AppealReasonFormDcComponent', () => {
  let component: AppealReasonFormDcComponent;
  let fixture: ComponentFixture<AppealReasonFormDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppealReasonFormDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealReasonFormDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
