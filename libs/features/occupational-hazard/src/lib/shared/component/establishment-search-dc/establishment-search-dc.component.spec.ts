import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentSearchDcComponent } from './establishment-search-dc.component';

describe('EstablishmentSearchDcComponent', () => {
  let component: EstablishmentSearchDcComponent;
  let fixture: ComponentFixture<EstablishmentSearchDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstablishmentSearchDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentSearchDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
