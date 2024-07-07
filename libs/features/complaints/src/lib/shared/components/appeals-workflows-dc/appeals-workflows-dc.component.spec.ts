import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealsWorkflowsDcComponent } from './appeals-workflows-dc.component';

describe('AppealsWorkflowsDcComponent', () => {
  let component: AppealsWorkflowsDcComponent;
  let fixture: ComponentFixture<AppealsWorkflowsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealsWorkflowsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealsWorkflowsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
