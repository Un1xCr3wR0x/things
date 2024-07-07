import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminateEngagementScComponent } from './terminate-engagement-sc.component';

describe('TerminateEngagementScComponent', () => {
  let component: TerminateEngagementScComponent;
  let fixture: ComponentFixture<TerminateEngagementScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TerminateEngagementScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminateEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
