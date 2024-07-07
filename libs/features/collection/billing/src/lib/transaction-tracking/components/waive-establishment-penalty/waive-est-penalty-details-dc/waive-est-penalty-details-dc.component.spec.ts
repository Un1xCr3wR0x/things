import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiveEstPenaltyDetailsDcComponent } from './waive-est-penalty-details-dc.component';

describe('WaiveEstPenaltyDetailsDcComponent', () => {
  let component: WaiveEstPenaltyDetailsDcComponent;
  let fixture: ComponentFixture<WaiveEstPenaltyDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaiveEstPenaltyDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiveEstPenaltyDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
