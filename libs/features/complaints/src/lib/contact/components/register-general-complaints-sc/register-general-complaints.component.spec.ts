import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterGeneralComplaintsComponentSc } from './register-general-complaints.component';

describe('RegisterGeneralComplaintsComponent', () => {
  let component: RegisterGeneralComplaintsComponentSc;
  let fixture: ComponentFixture<RegisterGeneralComplaintsComponentSc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterGeneralComplaintsComponentSc]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterGeneralComplaintsComponentSc);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
