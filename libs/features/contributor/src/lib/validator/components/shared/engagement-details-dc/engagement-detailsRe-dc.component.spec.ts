import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementDetailsDcComponent } from './engagement-details-dc.component';

describe('EngagementDetailsDcComponent', () => {
  let component: EngagementDetailsDcComponent;
  let fixture: ComponentFixture<EngagementDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngagementDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EngagementDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
