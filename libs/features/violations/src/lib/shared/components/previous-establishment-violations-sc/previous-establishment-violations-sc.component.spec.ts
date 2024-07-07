import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousEstablishmentViolationsScComponent } from './previous-establishment-violations-sc.component';

describe('PreviousEstablishmentViolationsScComponent', () => {
  let component: PreviousEstablishmentViolationsScComponent;
  let fixture: ComponentFixture<PreviousEstablishmentViolationsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousEstablishmentViolationsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousEstablishmentViolationsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
