import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealFormDcComponent } from './appeal-form-dc.component';

describe('AppealFormDcComponent', () => {
  let component: AppealFormDcComponent;
  let fixture: ComponentFixture<AppealFormDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealFormDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealFormDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
