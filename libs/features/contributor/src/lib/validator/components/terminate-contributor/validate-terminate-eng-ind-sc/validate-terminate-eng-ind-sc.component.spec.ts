import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTerminateEngIndScComponent } from './validate-terminate-eng-ind-sc.component';

describe('ValidateTerminateEngIndScComponent', () => {
  let component: ValidateTerminateEngIndScComponent;
  let fixture: ComponentFixture<ValidateTerminateEngIndScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateTerminateEngIndScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateTerminateEngIndScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
