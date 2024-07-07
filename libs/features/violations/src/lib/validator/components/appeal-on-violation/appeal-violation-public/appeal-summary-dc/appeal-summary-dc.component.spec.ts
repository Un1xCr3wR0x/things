import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealSummaryDcComponent } from './appeal-summary-dc.component';

describe('AppealSummaryComponent', () => {
  let component: AppealSummaryDcComponent;
  let fixture: ComponentFixture<AppealSummaryDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealSummaryDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealSummaryDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
