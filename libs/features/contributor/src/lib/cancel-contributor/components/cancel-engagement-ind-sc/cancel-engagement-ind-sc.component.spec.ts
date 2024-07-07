import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelEngagementIndScComponent } from './cancel-engagement-ind-sc.component';

describe('CancelEngagementIndScComponent', () => {
  let component: CancelEngagementIndScComponent;
  let fixture: ComponentFixture<CancelEngagementIndScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelEngagementIndScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelEngagementIndScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
