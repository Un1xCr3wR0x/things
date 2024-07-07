import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepientEstablishmentDetailsDcComponent } from './recepient-establishment-details-dc.component';

describe('RecepientEstablishmentDetailsDcComponent', () => {
  let component: RecepientEstablishmentDetailsDcComponent;
  let fixture: ComponentFixture<RecepientEstablishmentDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecepientEstablishmentDetailsDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepientEstablishmentDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
