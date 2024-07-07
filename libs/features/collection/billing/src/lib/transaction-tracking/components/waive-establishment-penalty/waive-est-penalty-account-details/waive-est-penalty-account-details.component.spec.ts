import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiveEstPenaltyAccountDetailsComponent } from './waive-est-penalty-account-details.component';

describe('WaiveEstPenaltyAccountDetailsComponent', () => {
  let component: WaiveEstPenaltyAccountDetailsComponent;
  let fixture: ComponentFixture<WaiveEstPenaltyAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaiveEstPenaltyAccountDetailsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiveEstPenaltyAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
