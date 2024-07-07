import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateGregorianDcComponent } from './date-gregorian-dc.component';

describe('DateGregorianDcComponent', () => {
  let component: DateGregorianDcComponent;
  let fixture: ComponentFixture<DateGregorianDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DateGregorianDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateGregorianDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
