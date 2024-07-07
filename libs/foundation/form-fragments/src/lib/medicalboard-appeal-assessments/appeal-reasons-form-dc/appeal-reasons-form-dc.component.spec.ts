import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealReasonsFormDcComponent } from './appeal-reasons-form-dc.component';

describe('AppealReasonsFormDcComponent', () => {
  let component: AppealReasonsFormDcComponent;
  let fixture: ComponentFixture<AppealReasonsFormDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealReasonsFormDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealReasonsFormDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
