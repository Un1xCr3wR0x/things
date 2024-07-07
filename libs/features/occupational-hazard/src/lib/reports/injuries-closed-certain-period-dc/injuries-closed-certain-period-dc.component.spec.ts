import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuriesClosedCertainPeriodDcComponent } from './injuries-closed-certain-period-dc.component';

describe('InjuriesClosedCertainPeriodDcComponent', () => {
  let component: InjuriesClosedCertainPeriodDcComponent;
  let fixture: ComponentFixture<InjuriesClosedCertainPeriodDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuriesClosedCertainPeriodDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuriesClosedCertainPeriodDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
