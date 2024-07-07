import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentContactDetailsScComponent } from './establishment-contact-details-sc.component';

describe('EstablishmentContactDetailsScComponent', () => {
  let component: EstablishmentContactDetailsScComponent;
  let fixture: ComponentFixture<EstablishmentContactDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentContactDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentContactDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
