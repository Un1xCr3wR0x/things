import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorReactivateEngagementScComponent } from './validator-reactivate-engagement-sc.component';

describe('ValidatorReactivateEngagementScComponent', () => {
  let component: ValidatorReactivateEngagementScComponent;
  let fixture: ComponentFixture<ValidatorReactivateEngagementScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidatorReactivateEngagementScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorReactivateEngagementScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
