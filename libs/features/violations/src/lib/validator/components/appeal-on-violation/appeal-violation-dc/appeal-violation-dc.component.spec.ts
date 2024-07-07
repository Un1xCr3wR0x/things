import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealViolationDcComponent } from './appeal-violation-dc.component';

describe('ValidatorAppealViolationDcComponent', () => {
  let component: AppealViolationDcComponent;
  let fixture: ComponentFixture<AppealViolationDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealViolationDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealViolationDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
