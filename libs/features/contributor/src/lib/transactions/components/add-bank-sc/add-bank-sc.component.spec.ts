import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankScComponent } from './add-bank-sc.component';

describe('AddBankScComponent', () => {
  let component: AddBankScComponent;
  let fixture: ComponentFixture<AddBankScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddBankScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
