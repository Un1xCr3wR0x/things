import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyDisabilityDetailsDcComponent } from './early-disability-details-dc.component';

describe('EarlyDisabilityDetailsDcComponent', () => {
  let component: EarlyDisabilityDetailsDcComponent;
  let fixture: ComponentFixture<EarlyDisabilityDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyDisabilityDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyDisabilityDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
