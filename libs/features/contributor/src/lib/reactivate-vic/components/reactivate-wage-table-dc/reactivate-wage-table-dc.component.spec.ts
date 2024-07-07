import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateWageTableDcComponent } from './reactivate-wage-table-dc.component';

describe('ReactivateWageTableDcComponent', () => {
  let component: ReactivateWageTableDcComponent;
  let fixture: ComponentFixture<ReactivateWageTableDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactivateWageTableDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateWageTableDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
