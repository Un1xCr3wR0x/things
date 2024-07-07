import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterRpaValidatorScComponent } from './enter-rpa-validator-sc.component';

describe('EnterRpaValidatorScComponent', () => {
  let component: EnterRpaValidatorScComponent;
  let fixture: ComponentFixture<EnterRpaValidatorScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterRpaValidatorScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterRpaValidatorScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
