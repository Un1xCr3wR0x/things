import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiveEstablishmentPenaltyScComponent } from './waive-establishment-penalty-sc.component';

describe('WaiveEstablishmentPenaltyScComponent', () => {
  let component: WaiveEstablishmentPenaltyScComponent;
  let fixture: ComponentFixture<WaiveEstablishmentPenaltyScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WaiveEstablishmentPenaltyScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiveEstablishmentPenaltyScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
