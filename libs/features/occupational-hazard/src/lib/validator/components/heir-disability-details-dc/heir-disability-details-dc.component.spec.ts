import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeirDisabilityDetailsDcComponent } from './heir-disability-details-dc.component';

describe('HeirDisabilityDetailsDcComponent', () => {
  let component: HeirDisabilityDetailsDcComponent;
  let fixture: ComponentFixture<HeirDisabilityDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeirDisabilityDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeirDisabilityDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
