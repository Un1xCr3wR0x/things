import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealContributorsDetailsDcComponent } from './appeal-contributors-details-dc.component';

describe('AppealContributorDetailDcComponent', () => {
  let component: AppealContributorsDetailsDcComponent;
  let fixture: ComponentFixture<AppealContributorsDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppealContributorsDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealContributorsDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
