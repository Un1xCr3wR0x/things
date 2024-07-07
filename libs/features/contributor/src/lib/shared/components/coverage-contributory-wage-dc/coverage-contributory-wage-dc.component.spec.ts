import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverageContributoryWageDcComponent } from './coverage-contributory-wage-dc.component';

describe('CoverageContributoryWageDcComponent', () => {
  let component: CoverageContributoryWageDcComponent;
  let fixture: ComponentFixture<CoverageContributoryWageDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverageContributoryWageDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverageContributoryWageDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
