import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealRequestorDetailsDcComponent } from './appeal-requestor-details-dc.component';

describe('AppealCustomerDetailDcComponent', () => {
  let component: AppealRequestorDetailsDcComponent;
  let fixture: ComponentFixture<AppealRequestorDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealRequestorDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealRequestorDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
