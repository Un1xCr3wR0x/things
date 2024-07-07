import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPassportDcComponent } from './add-passport-dc.component';

describe('AddPassportDcComponent', () => {
  let component: AddPassportDcComponent;
  let fixture: ComponentFixture<AddPassportDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPassportDcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
