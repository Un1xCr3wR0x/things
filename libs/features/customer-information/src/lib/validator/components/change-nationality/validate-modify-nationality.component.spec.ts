import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateModifyNationalityComponent } from './validate-modify-nationality.component';

describe('ValidateModifyNationalityComponent', () => {
  let component: ValidateModifyNationalityComponent;
  let fixture: ComponentFixture<ValidateModifyNationalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateModifyNationalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateModifyNationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
