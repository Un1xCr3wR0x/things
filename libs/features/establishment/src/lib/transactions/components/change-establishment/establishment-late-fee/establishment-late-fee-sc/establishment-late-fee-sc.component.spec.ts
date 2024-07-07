import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentLateFeeScComponent } from './establishment-late-fee-sc.component';

describe('EstablishmentLateFeeScComponent', () => {
  let component: EstablishmentLateFeeScComponent;
  let fixture: ComponentFixture<EstablishmentLateFeeScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentLateFeeScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentLateFeeScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
