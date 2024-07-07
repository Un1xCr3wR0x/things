import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTwoComponent } from './approval-two.component';

describe('ApprovalTwoComponent', () => {
  let component: ApprovalTwoComponent;
  let fixture: ComponentFixture<ApprovalTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
