import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjuriesTreatmentMoreThanCertainPeriodDcComponent } from './injuries-treatment-more-than-certain-period-dc.component';

describe('InjuriesTreatmentMoreThanCertainPeriodDcComponent', () => {
  let component: InjuriesTreatmentMoreThanCertainPeriodDcComponent;
  let fixture: ComponentFixture<InjuriesTreatmentMoreThanCertainPeriodDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjuriesTreatmentMoreThanCertainPeriodDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InjuriesTreatmentMoreThanCertainPeriodDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
