import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ERegistrationScComponent } from './e-registration-sc.component';

describe('ERegistrationScComponent', () => {
  let component: ERegistrationScComponent;
  let fixture: ComponentFixture<ERegistrationScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ERegistrationScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ERegistrationScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
