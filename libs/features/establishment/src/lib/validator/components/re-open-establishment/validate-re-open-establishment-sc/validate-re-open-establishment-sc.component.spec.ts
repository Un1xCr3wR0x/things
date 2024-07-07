import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateReOpenEstablishmentScComponent } from './validate-re-open-establishment-sc.component';

describe('ReOpenEstablishmentScComponent', () => {
  let component: ValidateReOpenEstablishmentScComponent;
  let fixture: ComponentFixture<ValidateReOpenEstablishmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValidateReOpenEstablishmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateReOpenEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
