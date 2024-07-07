import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiveEstLateFeesDetailsDcComponent } from './waive-est-late-fees-details-dc.component';

describe('WaiveEstLateFeesDetailsDcComponent', () => {
  let component: WaiveEstLateFeesDetailsDcComponent;
  let fixture: ComponentFixture<WaiveEstLateFeesDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaiveEstLateFeesDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiveEstLateFeesDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
