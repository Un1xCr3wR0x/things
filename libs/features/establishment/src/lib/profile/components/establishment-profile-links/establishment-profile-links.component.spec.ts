import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentProfileLinksComponent } from './establishment-profile-links.component';

describe('EstablishmentProfileLinksComponent', () => {
  let component: EstablishmentProfileLinksComponent;
  let fixture: ComponentFixture<EstablishmentProfileLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstablishmentProfileLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentProfileLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
