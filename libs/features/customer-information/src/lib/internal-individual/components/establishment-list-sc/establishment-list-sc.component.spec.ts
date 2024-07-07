import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentListScComponent } from './establishment-list-sc.component';

describe('EstablishmentListScComponent', () => {
  let component: EstablishmentListScComponent;
  let fixture: ComponentFixture<EstablishmentListScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstablishmentListScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentListScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
