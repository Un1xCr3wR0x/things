import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentBasicDetailsScComponent } from './establishment-basic-details-sc.component';

describe('EstablishmentBasicDetailsScComponent', () => {
  let component: EstablishmentBasicDetailsScComponent;
  let fixture: ComponentFixture<EstablishmentBasicDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentBasicDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentBasicDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
