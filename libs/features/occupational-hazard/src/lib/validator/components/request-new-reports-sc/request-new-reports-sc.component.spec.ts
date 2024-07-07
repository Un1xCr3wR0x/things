import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestNewReportsScComponent } from './request-new-reports-sc.component';

describe('RequestNewReportsDcComponent', () => {
  let component: RequestNewReportsScComponent;
  let fixture: ComponentFixture<RequestNewReportsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestNewReportsScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestNewReportsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
