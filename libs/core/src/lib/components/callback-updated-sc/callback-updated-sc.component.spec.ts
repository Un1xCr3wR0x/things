import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallbackUpdatedScComponent } from './callback-updated-sc.component';

describe('CallbackUpdatedScComponent', () => {
  let component: CallbackUpdatedScComponent;
  let fixture: ComponentFixture<CallbackUpdatedScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CallbackUpdatedScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackUpdatedScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
