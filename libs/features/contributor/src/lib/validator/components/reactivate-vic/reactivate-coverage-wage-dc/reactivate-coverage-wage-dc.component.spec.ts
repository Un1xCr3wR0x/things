import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateCoverageWageDcComponent } from './reactivate-coverage-wage-dc.component';

describe('ReactivateCoverageWageDcComponent', () => {
  let component: ReactivateCoverageWageDcComponent;
  let fixture: ComponentFixture<ReactivateCoverageWageDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactivateCoverageWageDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateCoverageWageDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
