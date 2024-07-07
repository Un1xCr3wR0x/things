import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEngagementScComponent } from './cancel-engagement-sc.component';

describe('CancelEngagementScComponent', () => {
  let component: CancelEngagementScComponent;
  let fixture: ComponentFixture<CancelEngagementScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelEngagementScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
