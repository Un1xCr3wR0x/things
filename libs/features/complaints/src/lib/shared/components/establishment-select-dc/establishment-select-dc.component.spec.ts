import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentSelectDcComponent } from './establishment-select-dc.component';

describe('EstablishmentSelectDcComponent', () => {
  let component: EstablishmentSelectDcComponent;
  let fixture: ComponentFixture<EstablishmentSelectDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentSelectDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentSelectDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
