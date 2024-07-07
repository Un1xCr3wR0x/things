import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalOneComponent } from './approval-one.component';

describe('ApprovalOneComponent', () => {
  let component: ApprovalOneComponent;
  let fixture: ComponentFixture<ApprovalOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalOneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
