import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagEstablishmentScComponent } from './flag-establishment-sc.component';

describe('FlagEstablishmentScComponent', () => {
  let component: FlagEstablishmentScComponent;
  let fixture: ComponentFixture<FlagEstablishmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlagEstablishmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
