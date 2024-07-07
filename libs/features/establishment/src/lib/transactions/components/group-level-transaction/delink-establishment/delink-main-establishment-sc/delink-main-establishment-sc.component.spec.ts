import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelinkMainEstablishmentScComponent } from './delink-main-establishment-sc.component';

describe('DelinkMainEstablishmentScComponent', () => {
  let component: DelinkMainEstablishmentScComponent;
  let fixture: ComponentFixture<DelinkMainEstablishmentScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelinkMainEstablishmentScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DelinkMainEstablishmentScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
