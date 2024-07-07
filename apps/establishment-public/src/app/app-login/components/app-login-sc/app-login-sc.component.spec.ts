import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginScComponent } from './app-login-sc.component';

describe('AppLoginScComponent', () => {
  let component: AppLoginScComponent;
  let fixture: ComponentFixture<AppLoginScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppLoginScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoginScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
