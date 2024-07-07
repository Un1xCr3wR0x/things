import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProactiveRegScComponent } from './complete-proactive-reg-sc.component';

describe('CompleteProactiveRegScComponent', () => {
  let component: CompleteProactiveRegScComponent;
  let fixture: ComponentFixture<CompleteProactiveRegScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompleteProactiveRegScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteProactiveRegScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
