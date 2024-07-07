import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItsmDetailsDcComponent } from './itsm-details-dc.component';

describe('ItsmDetailsDcComponent', () => {
  let component: ItsmDetailsDcComponent;
  let fixture: ComponentFixture<ItsmDetailsDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItsmDetailsDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItsmDetailsDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
