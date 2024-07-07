import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateConversionDcComponent } from './input-date-conversion-dc.component';

describe('InputDateConversionDcComponent', () => {
  let component: InputDateConversionDcComponent;
  let fixture: ComponentFixture<InputDateConversionDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputDateConversionDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDateConversionDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
