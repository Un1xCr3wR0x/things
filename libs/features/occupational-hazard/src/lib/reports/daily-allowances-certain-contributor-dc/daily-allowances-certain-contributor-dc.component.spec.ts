import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyAllowancesCertainContributorDcComponent } from './daily-allowances-certain-contributor-dc.component';

describe('DailyAllowancesCertainContributorDcComponent', () => {
  let component: DailyAllowancesCertainContributorDcComponent;
  let fixture: ComponentFixture<DailyAllowancesCertainContributorDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyAllowancesCertainContributorDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyAllowancesCertainContributorDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
