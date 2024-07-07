import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterRpaEngagementDetailsDcComponent } from './enter-rpa-engagement-details-dc.component';

describe('EnterRpaEngagementDetailsDcComponent', () => {
  let component: EnterRpaEngagementDetailsDcComponent;
  let fixture: ComponentFixture<EnterRpaEngagementDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterRpaEngagementDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterRpaEngagementDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
