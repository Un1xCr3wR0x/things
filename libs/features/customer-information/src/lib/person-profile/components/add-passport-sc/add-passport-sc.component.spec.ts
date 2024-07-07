import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPassportScComponent } from './add-passport-sc.component';

describe('AddPassportScComponent', () => {
  let component: AddPassportScComponent;
  let fixture: ComponentFixture<AddPassportScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPassportScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPassportScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
