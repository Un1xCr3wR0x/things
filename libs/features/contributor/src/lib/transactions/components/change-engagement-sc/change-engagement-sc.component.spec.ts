import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEngagementScComponent } from './change-engagement-sc.component';

describe('ChangeEngagementScComponent', () => {
  let component: ChangeEngagementScComponent;
  let fixture: ComponentFixture<ChangeEngagementScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeEngagementScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
