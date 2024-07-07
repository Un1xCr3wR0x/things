import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorListDcComponent } from './contributor-list-dc.component';

describe('ContributorListDcComponent', () => {
  let component: ContributorListDcComponent;
  let fixture: ComponentFixture<ContributorListDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContributorListDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContributorListDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
