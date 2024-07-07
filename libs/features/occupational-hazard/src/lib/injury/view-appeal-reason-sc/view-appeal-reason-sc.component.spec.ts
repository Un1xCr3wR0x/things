import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAppealReasonScComponent } from './view-appeal-reason-sc.component';

describe('ViewAppealReasonScComponent', () => {
  let component: ViewAppealReasonScComponent;
  let fixture: ComponentFixture<ViewAppealReasonScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAppealReasonScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAppealReasonScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
