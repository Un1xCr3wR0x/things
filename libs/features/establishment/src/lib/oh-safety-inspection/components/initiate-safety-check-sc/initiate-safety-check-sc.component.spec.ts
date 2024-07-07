import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateSafetyCheckScComponent } from './initiate-safety-check-sc.component';

describe('InitiateSafetyCheckScComponent', () => {
  let component: InitiateSafetyCheckScComponent;
  let fixture: ComponentFixture<InitiateSafetyCheckScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiateSafetyCheckScComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiateSafetyCheckScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
