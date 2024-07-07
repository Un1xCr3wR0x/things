import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateVicDetailsDcComponent } from './reactivate-vic-details-dc.component';

describe('ReactivateVicDetailsDcComponent', () => {
  let component: ReactivateVicDetailsDcComponent;
  let fixture: ComponentFixture<ReactivateVicDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactivateVicDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactivateVicDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
