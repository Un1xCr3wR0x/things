import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDateHighlightedDcComponent } from './input-date-highlighted-dc.component';

describe('InputDateHighlightedDcComponent', () => {
  let component: InputDateHighlightedDcComponent;
  let fixture: ComponentFixture<InputDateHighlightedDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputDateHighlightedDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDateHighlightedDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
