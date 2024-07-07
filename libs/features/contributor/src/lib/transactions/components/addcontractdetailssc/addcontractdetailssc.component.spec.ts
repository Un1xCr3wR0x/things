import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcontractdetailsscComponent } from './addcontractdetailssc.component';

describe('AddcontractdetailsscComponent', () => {
  let component: AddcontractdetailsscComponent;
  let fixture: ComponentFixture<AddcontractdetailsscComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddcontractdetailsscComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcontractdetailsscComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
